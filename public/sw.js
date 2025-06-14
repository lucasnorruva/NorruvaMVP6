
const CACHE_NAME = 'norruva-dpp-cache-v1';
const APP_SHELL_URLS = [
  '/',
  '/manifest.json',
  // Add other critical app shell assets here like main CSS/JS if names are predictable
  // Or rely on caching during runtime for Next.js hashed assets.
  // '/favicon.ico', // Browsers often request this
  // '/offline.html' // Placeholder for a dedicated offline page
];
const API_PREFIX = '/api/v1/dpp/';

// Install event: Cache the app shell
self.addEventListener('install', (event) => {
  console.log('[SW] Install event');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching app shell:', APP_SHELL_URLS);
      return cache.addAll(APP_SHELL_URLS).catch(error => {
        console.error('[SW] Failed to cache app shell resources during install:', error);
      });
    })
  );
});

// Activate event: Clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activate event');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch event: Serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // For navigation requests (HTML pages), try network first, then cache.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // If successful, cache a clone of the response for future offline use.
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Network failed, try to serve from cache.
          return caches.match(request).then((cachedResponse) => {
            return cachedResponse; // Placeholder for offline page: || caches.match('/offline.html');
          });
        })
    );
    return;
  }

  // Cache first for app shell URLs
  if (APP_SHELL_URLS.includes(request.url)) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then((networkResponse) => {
          if (networkResponse.ok) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        }).catch(error => {
            console.error('[SW] Fetch failed for app shell resource:', request.url, error);
            // Optionally return a fallback for critical app shell assets if needed
        });
      })
    );
    return;
  }
  
  // Network first, then cache for API GET requests
  if (request.method === 'GET' && request.url.includes(API_PREFIX)) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // For API calls, if not in cache and network fails,
            // returning an error response might be better than nothing.
            return new Response(JSON.stringify({ error: 'Network error and not in cache' }), {
              headers: { 'Content-Type': 'application/json' },
              status: 503, // Service Unavailable
              statusText: 'Network error, data might be stale or unavailable.'
            });
          });
        })
    );
    return;
  }

  // For non-GET API requests or other assets, try network only by default.
  // You might want to implement a cache-first strategy for other static assets (images, fonts).
  event.respondWith(
      caches.match(request).then((cachedResponse) => {
        return cachedResponse || fetch(request).then(networkResponse => {
            // Optionally cache other successful GET requests for static assets
            if (request.method === 'GET' && networkResponse.ok && !request.url.includes('/api/')) {
                 const responseClone = networkResponse.clone();
                 caches.open(CACHE_NAME).then(cache => cache.put(request, responseClone));
            }
            return networkResponse;
        }).catch(error => {
            console.warn('[SW] Unhandled fetch, falling back to network, error:', request.url, error);
            // For unhandled errors / asset types, could return a generic fallback or just let it fail
        });
      })
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
