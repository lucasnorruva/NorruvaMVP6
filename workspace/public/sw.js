
const CACHE_NAME = 'norruva-dpp-cache-v1';
const urlsToCache = [
  '/',
  '/dashboard',
  // Add other critical shell paths here
  // Note: Be careful with caching dynamic API routes or large assets initially.
  // For actual offline functionality, a more sophisticated strategy is needed.
];

self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Install');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[ServiceWorker] Caching app shell');
        return cache.addAll(urlsToCache.map(url => new Request(url, { cache: 'reload' }))); // Force reload to avoid cached opaque responses
      })
      .catch(error => {
        console.error('[ServiceWorker] Failed to cache app shell:', error);
      })
  );
});

self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activate');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  console.log('[ServiceWorker] Fetch event for:', event.request.url);
  // Basic cache-first strategy for GET requests
  if (event.request.method === 'GET') {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          if (response) {
            console.log('[ServiceWorker] Found in cache:', event.request.url);
            return response;
          }
          console.log('[ServiceWorker] Not found in cache, fetching from network:', event.request.url);
          return fetch(event.request).then(
            (networkResponse) => {
              // Optionally, cache the new response here if it's a cachable asset
              // Be careful with caching API responses without a proper strategy
              return networkResponse;
            }
          ).catch(error => {
            console.error('[ServiceWorker] Fetch failed:', error);
            // Optionally, return an offline page here
            // return caches.match('/offline.html');
          });
        })
    );
  }
});
