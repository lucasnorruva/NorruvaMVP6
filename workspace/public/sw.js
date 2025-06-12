const CACHE_NAME = 'norruva-dpp-cache-v1';
const PRECACHE_ASSETS = [
  '/',
  '/dashboard',
  '/globals.css',
  // Consider adding logo URL if stable and desired for offline:
  // 'https://firebasestorage.googleapis.com/v0/b/norruva.firebasestorage.app/o/Norruva%20Logo.png?alt=media&token=08d8ede9-1121-433b-bfa5-7ccb4497a09f'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Pre-caching offline page and assets:', PRECACHE_ASSETS);
      return cache.addAll(PRECACHE_ASSETS);
    }).catch(error => {
      console.error('[ServiceWorker] Pre-caching failed:', error);
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
            console.log('[ServiceWorker] Old cache removed:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  const requestUrl = new URL(event.request.url);

  // Cache-first for pre-cached assets (matching by pathname)
  if (PRECACHE_ASSETS.includes(requestUrl.pathname)) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).then((networkResponse) => {
          // Optionally cache if it was missed during initial pre-cache
          // cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      })
    );
    return;
  }

  // Network-first for other GET requests, then cache
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(async () => {
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }
        // Optional: Generic fallback for navigation requests. 
        // Requires an 'offline.html' to be pre-cached.
        // if (event.request.mode === 'navigate') {
        //   return caches.match('/offline.html');
        // }
        return new Response("Network error and resource not found in cache.", {
            status: 408, // Request Timeout
            headers: { 'Content-Type': 'text/plain' },
        });
      })
  );
});
