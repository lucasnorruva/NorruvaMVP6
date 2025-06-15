const CACHE_NAME = 'norruva-dpp-cache-v1.3'; // Incremented version
const OFFLINE_URL = '/offline.html';
const CORE_ASSETS = [
  '/',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  OFFLINE_URL,
  // Add paths to your main CSS and JS bundles if they are consistently named
  // e.g., '/_next/static/css/main.css', '/_next/static/chunks/main-app.js'
  // Be cautious with aggressively caching Next.js dynamic chunks as their names change.
];

self.addEventListener('install', (event) => {
  console.log('[Service Worker] Install event in progress.');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching core assets:', CORE_ASSETS);
      return cache.addAll(CORE_ASSETS);
    }).catch(error => {
      console.error('[Service Worker] Failed to cache core assets:', error);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activate event in progress.');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim(); // Ensure new SW takes control immediately
});

self.addEventListener('fetch', (event) => {
  const request = event.request;

  // For navigation requests, try network first, then cache, then offline page.
  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const networkResponse = await fetch(request);
          return networkResponse;
        } catch (error) {
          console.log('[Service Worker] Network request failed, trying cache for navigation:', request.url);
          const cache = await caches.open(CACHE_NAME);
          const cachedResponse = await cache.match(request);
          if (cachedResponse) {
            return cachedResponse;
          }
          // If both network and cache fail, serve the offline page.
          console.log('[Service Worker] Serving offline page for navigation failure.');
          return await cache.match(OFFLINE_URL);
        }
      })()
    );
    return;
  }

  // For other requests (CSS, JS, images), use a cache-first strategy.
  // If it's a core asset, it should be in the cache.
  // For other assets, try cache, then network.
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // console.log('[Service Worker] Serving from cache:', request.url);
        return cachedResponse;
      }
      // console.log('[Service Worker] Fetching from network:', request.url);
      return fetch(request).then((networkResponse) => {
        // Optionally, cache new assets dynamically here if desired
        // Be careful not to cache everything, especially API responses that change frequently.
        // For example, cache only if it's a GET request and from your own origin or a known CDN.
        if (request.method === 'GET' && 
            (request.url.startsWith(self.origin) || request.url.startsWith('https://fonts.gstatic.com'))) {
          // console.log('[Service Worker] Caching new asset:', request.url);
          // const cache = await caches.open(CACHE_NAME);
          // cache.put(request, networkResponse.clone());
        }
        return networkResponse;
      }).catch(() => {
        // For non-navigation requests, if network fails and not in cache,
        // just let it fail (browser default behavior).
        // Specific offline fallbacks for images/data can be added if needed.
        // console.warn('[Service Worker] Failed to fetch from network or cache:', request.url);
      });
    })
  );
});
