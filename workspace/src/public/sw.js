
const CACHE_NAME = 'norruva-dpp-cache-v3'; // Incremented version
const CORE_ASSETS_TO_CACHE = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/favicon.ico', // Assuming you have one
  '/icons/icon-192x192.png',
  '/icons/icon-384x384.png',
  '/icons/icon-512x512.png',
  // Add critical JS/CSS bundles if Next.js doesn't hash them uniquely or if you want them precached.
  // Next.js usually handles its own static assets (_next/static/...) with hashes for good caching.
];
const API_CACHE_NAME = 'norruva-dpp-api-cache-v1';
const MAX_API_CACHE_ENTRIES = 50;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Opened core asset cache. Caching initial assets:', CORE_ASSETS_TO_CACHE);
        return cache.addAll(CORE_ASSETS_TO_CACHE);
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
          if (cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(()(() => self.clients.claim())
  );
});

// Helper to limit cache size
async function limitCacheSize(cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length > maxEntries) {
    // Delete the oldest entries
    for (let i = 0; i < keys.length - maxEntries; i++) {
      await cache.delete(keys[i]);
    }
    console.log(`[Service Worker] Trimmed cache ${cacheName} to ${maxEntries} entries.`);
  }
}

self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // Navigate requests: Try network first, then cache for core assets, then offline page
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // If network is available, return the response
          return response;
        })
        .catch(async () => {
          // Network failed, try to serve from cache if it's a core asset
          const cachedResponse = await caches.match(event.request);
          if (cachedResponse) {
            return cachedResponse;
          }
          // If not in cache or not a core asset, serve the offline page
          return caches.match('/offline.html')
                 .then(offlineResponse => offlineResponse || new Response("Offline fallback page not found", { status: 404, headers: { 'Content-Type': 'text/plain' }));
        })
    );
    return;
  }

  // API GET requests: Stale-while-revalidate
  if (requestUrl.pathname.startsWith('/api/v1/') && event.request.method === 'GET') {
    event.respondWith(
      caches.open(API_CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(event.request);
        const networkResponsePromise = fetch(event.request).then((networkResponse) => {
          if (networkResponse.ok) {
            cache.put(event.request, networkResponse.clone());
            limitCacheSize(API_CACHE_NAME, MAX_API_CACHE_ENTRIES); // Trim cache after adding
          }
          return networkResponse;
        }).catch(() => {
          // If network fails after checking cache, and we had a cached response, return it
          // This ensures if we have stale data and network fails, we can still serve stale data.
          if (cachedResponse) return cachedResponse;
          // If no cache and network fails, this will propagate the network error.
          // Or, you could return a custom offline JSON response for APIs.
          return new Response(JSON.stringify({ error: "Network error and no cached data available." }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
          });
        });
        return cachedResponse || networkResponsePromise;
      })
    );
    return;
  }

  // Static assets: Cache first, then network
  // This includes assets Next.js might serve from _next/static or public folder assets
  if (CORE_ASSETS_TO_CACHE.includes(requestUrl.pathname) || 
      requestUrl.pathname.startsWith('/_next/static/') ||
      requestUrl.pathname.match(/\.(css|js|png|jpg|jpeg|svg|woff2|ico)$/)) {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          if (response) {
            return response;
          }
          return fetch(event.request).then((networkResponse) => {
            if (networkResponse.ok) {
              return caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, networkResponse.clone());
                return networkResponse;
              });
            }
            return networkResponse;
          });
        })
        .catch(() => {
           // If a core static asset (like CSS/JS for app shell) fails and isn't cached,
           // it could break the app. The navigate fallback might catch this if it's a navigation request.
           // For direct asset requests failing, there isn't much to do other than let it fail.
           // For a very basic offline experience, we make sure `offline.html` is cached.
           if (requestUrl.pathname === '/offline.html') {
               return new Response("Offline page error.", { status: 500 });
           }
           // Fallback for other assets if necessary, or let it fail.
        })
    );
    return;
  }

  // Default: Network Only for non-GET API calls or other types of requests
  // For POST, PUT, PATCH, DELETE, we generally want to hit the network.
  // If offline, these will fail, and the app UI should handle that.
  if (event.request.method !== 'GET') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(JSON.stringify({ error: "Network error. This action cannot be performed offline." }), {
          status: 503, // Service Unavailable
          headers: { 'Content-Type': 'application/json' }
        });
      })
    );
    return;
  }
  
  // Final fallback: just try to fetch.
  event.respondWith(fetch(event.request));
});
