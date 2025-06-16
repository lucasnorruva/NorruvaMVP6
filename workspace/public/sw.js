const CACHE_NAME = 'norruva-dpp-cache-v2'; // Increment version on significant changes
const urlsToCache = [
  '/',
  '/offline.html',
  // Add other core static assets if they are not dynamically hashed by Next.js
  // e.g., '/fonts/Inter-Regular.woff2', '/logo.svg'
  // Next.js build output (/_next/static/...) is typically versioned and handled by its own caching mechanisms.
  // We focus on the app shell and offline page here.
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Opened cache and caching initial assets:', urlsToCache);
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('[Service Worker] Failed to cache initial assets:', error);
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
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // Navigate requests: Try network first, then cache, then offline page
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match(urlsToCache.includes(requestUrl.pathname) ? requestUrl.pathname : '/offline.html')
                 .then(response => response || caches.match('/offline.html'));
        })
    );
    return;
  }

  // API GET requests: Stale-while-revalidate
  if (requestUrl.pathname.startsWith('/api/v1/dpp') && event.request.method === 'GET') {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(event.request);
        const networkResponsePromise = fetch(event.request).then((networkResponse) => {
          if (networkResponse.ok) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        });
        return cachedResponse || networkResponsePromise;
      }).catch(() => {
        // Optional: could return a generic API error response from cache if really needed
        // For now, just let network failures propagate if no cache.
        return fetch(event.request);
      })
    );
    return;
  }

  // Static assets: Cache first, then network
  if (urlsToCache.includes(requestUrl.pathname) || requestUrl.pathname.match(/\.(css|js|png|jpg|jpeg|svg|woff2)$/)) {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          if (response) {
            return response;
          }
          return fetch(event.request).then((networkResponse) => {
            if (networkResponse.ok) {
              caches.open(CACHE_NAME).then(cache => cache.put(event.request, networkResponse.clone()));
            }
            return networkResponse;
          });
        })
    );
    return;
  }

  // Default: Network first for everything else
  event.respondWith(fetch(event.request));
});
