const CACHE_NAME = 'norruva-dpp-cache-v1.3'; // Incremented version
const OFFLINE_URL = '/offline.html';
const CORE_ASSETS = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  // Add paths to critical JS/CSS bundles if known and stable
  // e.g., '/_next/static/css/main.css', '/_next/static/chunks/main-app.js'
  // Be careful with versioned Next.js assets, they might change frequently.
];

// Install - cache core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching core assets');
        return cache.addAll(CORE_ASSETS);
      })
      .then(() => self.skipWaiting()) // Activate worker immediately
  );
});

// Activate - clean up old caches
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
    }).then(() => self.clients.claim()) // Take control of all clients
  );
});

// Fetch - serving strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Strategy 1: Cache First for core assets (defined in CORE_ASSETS)
  if (CORE_ASSETS.includes(new URL(request.url).pathname)) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then((networkResponse) => {
          // Optional: Cache dynamically if not in CORE_ASSETS but deemed important
          return networkResponse;
        });
      })
    );
    return;
  }

  // Strategy 2: Network First, then Cache for API GET requests
  if (request.url.includes('/api/v1/dpp')) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          // Check if we received a valid response
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            // If network fails or response is not okay, try cache
            return caches.match(request).then(cachedResponse => cachedResponse || networkResponse);
          }
          // Clone the response because it's a stream and can only be consumed once.
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
          return networkResponse;
        })
        .catch(() => {
          // Network request failed, try to serve from cache
          return caches.match(request).then((cachedResponse) => {
            return cachedResponse || caches.match(OFFLINE_URL); // Fallback to offline page if not cached
          });
        })
    );
    return;
  }

  // Strategy 3: Cache Falling Back to Network (for other assets like images from placehold.co)
  // Or, if you want to be more aggressive: Stale-While-Revalidate for general assets
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      // Cache hit - return response
      if (cachedResponse) {
        return cachedResponse;
      }

      // Not in cache - fetch from network, then cache it
      return fetch(request).then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200) {
            // If fetch fails or returns an error, serve offline page for navigation requests
            if (request.mode === 'navigate') {
              return caches.match(OFFLINE_URL);
            }
            return networkResponse; // For non-navigation requests, just return the error
          }
          // Clone and cache successful responses
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
          return networkResponse;
        }
      ).catch(() => {
        // General fetch error (network down, etc.)
        if (request.mode === 'navigate') {
          return caches.match(OFFLINE_URL);
        }
        // For non-navigation, it's fine to let the browser handle the fetch error
      });
    })
  );
});
