const CACHE_NAME = 'norruva-dpp-cache-v1.1'; // Increment version to force update
const OFFLINE_URL = '/offline.html';
const ASSETS_TO_CACHE = [
  OFFLINE_URL,
  '/icons/icon-192x192.png',
  '/icons/icon-384x384.png',
  '/icons/icon-512x512.png',
  // Add paths to critical CSS/JS files that are part of the main app shell
  // e.g., '/_next/static/css/main.css', '/_next/static/chunks/main-app.js'
  // Be cautious not to cache too much or dynamic content that changes frequently.
  // For Next.js, dynamic imports and code splitting handle much of this,
  // so focus on truly static shell assets if needed.
  // The default Next.js PWA setup with something like next-pwa handles this more robustly.
  // For a basic custom SW, this is illustrative.
];

self.addEventListener('install', (event) => {
  console.log('[Service Worker] Install event');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching app shell and offline page');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => {
        // Force the waiting service worker to become the active service worker.
        return self.skipWaiting();
      })
  );
});

self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activate event');
  // Remove old caches
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
    }).then(() => {
      // Tell the active service worker to take control of the page immediately.
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', (event) => {
  // We only want to call event.respondWith() if this is a navigation request
  // for an HTML page.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          // First, try to use the navigation preload response if it's supported.
          const preloadResponse = await event.preloadResponse;
          if (preloadResponse) {
            return preloadResponse;
          }

          // Always try the network first for navigation requests.
          const networkResponse = await fetch(event.request);
          return networkResponse;
        } catch (error) {
          // catch is only triggered if an exception is thrown, which typically
          // means a network error.
          // If fetch() returns a valid HTTP response with a 4xx or 5xx status,
          // the catch() will NOT be called.
          console.log('[Service Worker] Fetch failed; returning offline page instead.', error);

          const cache = await caches.open(CACHE_NAME);
          const cachedResponse = await cache.match(OFFLINE_URL);
          return cachedResponse;
        }
      })()
    );
  } else if (ASSETS_TO_CACHE.includes(event.request.url.replace(self.location.origin, ''))) {
    // For assets we decided to cache explicitly, serve from cache falling back to network.
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return cachedResponse || fetch(event.request).then((networkResponse) => {
          // Optional: Cache newly fetched assets dynamically if needed
          // const cache = await caches.open(CACHE_NAME);
          // cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      })
    );
  }

  // For other requests, just fetch from network.
});
