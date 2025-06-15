const CACHE_NAME = 'norruva-dpp-cache-v1.6'; // Incremented cache version
const OFFLINE_URL = 'offline.html';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/offline.html',
  // Add other critical static assets if known, e.g., global CSS, logo.
  // Next.js assets (_next/static/...) are usually versioned and handled by its own caching,
  // but core PWA assets are good to cache here.
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        // Add offline.html to cache during install
        return cache.addAll(urlsToCache.concat(OFFLINE_URL));
      })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const preloadResponse = await event.preloadResponse;
          if (preloadResponse) {
            return preloadResponse;
          }

          const networkResponse = await fetch(event.request);
          return networkResponse;
        } catch (error) {
          console.log('Fetch failed; returning offline page instead.', error);

          const cache = await caches.open(CACHE_NAME);
          const cachedResponse = await cache.match(OFFLINE_URL);
          return cachedResponse;
        }
      })()
    );
  } else if (urlsToCache.includes(event.request.url) || event.request.destination === 'image' || event.request.destination === 'style' || event.request.destination === 'script') {
    // Cache-first strategy for specified URLs and common asset types
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).then((networkResponse) => {
          // Optionally, add successfully fetched assets to cache
          // if (networkResponse && networkResponse.status === 200) {
          //   const responseToCache = networkResponse.clone();
          //   caches.open(CACHE_NAME).then((cache) => {
          //     cache.put(event.request, responseToCache);
          //   });
          // }
          return networkResponse;
        }).catch(error => {
            console.log('Fetch failed for asset; no cache fallback.', event.request.url, error);
            // For assets, if they are not in cache and network fails, let it fail.
            // Alternatively, you could return a placeholder for images.
        });
      })
    );
  }
});
