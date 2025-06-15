
// --- Service Worker: public/sw.js ---

const CACHE_NAME = 'norruva-dpp-cache-v1.2'; // Incremented version for cache busting
const PRECACHE_ASSETS = [
  '/',
  '/manifest.json',
  // Add key static assets that are part of the shell, like logo, global CSS if not inlined
  // '/icons/icon-192x192.png', // Example, actual paths to your icons
  // '/icons/icon-512x512.png',
  // '/offline.html' // A dedicated offline fallback page (optional but good practice)
];

// Install event: precache core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[ServiceWorker] Pre-caching core assets:', PRECACHE_ASSETS);
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => {
        console.log('[ServiceWorker] Core assets pre-cached successfully.');
        return self.skipWaiting(); // Activate worker immediately
      })
      .catch(error => {
        console.error('[ServiceWorker] Pre-caching failed:', error);
      })
  );
});

// Activate event: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[ServiceWorker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[ServiceWorker] Activated and old caches cleaned.');
      return self.clients.claim(); // Take control of all open clients
    })
  );
});

// Fetch event: serve assets from cache if available, otherwise fetch from network
// Basic cache-first strategy for precached assets, network-first for others.
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // For API calls or Next.js data routes, always go to network first
  if (event.request.method === 'POST' || requestUrl.pathname.startsWith('/api/') || requestUrl.pathname.startsWith('/_next/data/')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        // Optional: provide a generic JSON error for API offline scenarios
        if (requestUrl.pathname.startsWith('/api/')) {
          return new Response(JSON.stringify({ error: 'Network error' }), {
            headers: { 'Content-Type': 'application/json' }
          });
        }
        // For Next.js data routes, might be harder to provide a meaningful fallback
      })
    );
    return;
  }

  // For other GET requests (static assets, pages)
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Cache hit - return response from cache
        if (cachedResponse) {
          // console.log('[ServiceWorker] Serving from cache:', event.request.url);
          return cachedResponse;
        }

        // Not in cache - fetch from network
        // console.log('[ServiceWorker] Fetching from network:', event.request.url);
        return fetch(event.request).then(
          (networkResponse) => {
            // Check if we received a valid response
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            const responseToCache = networkResponse.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                // console.log('[ServiceWorker] Caching new asset:', event.request.url);
                cache.put(event.request, responseToCache);
              });

            return networkResponse;
          }
        ).catch(() => {
          // If both cache and network fail (e.g., offline)
          // console.log('[ServiceWorker] Fetch failed, serving offline fallback for:', event.request.url);
          // You could return a custom offline fallback page here
          // For example: if (event.request.mode === 'navigate') return caches.match('/offline.html');
          // For this prototype, we'll just let the browser handle the offline error page
          // to avoid needing an `offline.html` page.
        });
      })
  );
});

// Optional: Listen for messages from client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
