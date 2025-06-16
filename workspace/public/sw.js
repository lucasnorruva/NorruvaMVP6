// Service Worker for Norruva DPP PWA

const CACHE_VERSION = 'norruva-dpp-cache-v7'; // Incremented version
const CORE_ASSETS_TO_CACHE = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  // Add other critical static assets if known, e.g., specific font files if self-hosted
];

// Install - Cache core assets
self.addEventListener('install', (event) => {
  console.log('[SW] Install event - v7');
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then((cache) => {
        console.log('[SW] Caching core assets:', CORE_ASSETS_TO_CACHE);
        return cache.addAll(CORE_ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
      .catch(error => console.error('[SW] Cache addAll failed during install:', error))
  );
});

// Activate - Clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activate event - v7');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_VERSION) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch - Implement caching strategies
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // Strategy 1: API GET requests - Network first, then cache, then specific offline for API
  if (requestUrl.pathname.startsWith('/api/v1/') && event.request.method === 'GET') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.ok) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_VERSION).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match(event.request)
            .then((cachedResponse) => {
              if (cachedResponse) return cachedResponse;
              // For API calls, if not in cache and network fails, return a structured error
              return new Response(JSON.stringify({ error: 'Offline', message: 'API data currently unavailable offline.' }), {
                headers: { 'Content-Type': 'application/json' },
                status: 503 // Service Unavailable
              });
            });
        })
    );
    return;
  }

  // Strategy 2: Static assets (icons, manifest, specific JS/CSS if predictable) - Cache first, then network
  if (CORE_ASSETS_TO_CACHE.some(assetPath => requestUrl.pathname.endsWith(assetPath)) || 
      requestUrl.pathname.startsWith('/_next/static/')) { // Cache Next.js static assets
    event.respondWith(
      caches.match(event.request)
        .then((cachedResponse) => {
          return cachedResponse || fetch(event.request).then((networkResponse) => {
            if (networkResponse && networkResponse.ok) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_VERSION).then((cache) => {
                cache.put(event.request, responseToCache);
              });
            }
            return networkResponse;
          }).catch(() => caches.match('/offline.html')); // Fallback for static assets
        })
    );
    return;
  }
  
  // Strategy 3: Navigation requests (HTML pages) - Network first, then cache, then offline page
  if (event.request.mode === 'navigate') {
     event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
           if (networkResponse && networkResponse.ok && requestUrl.protocol.startsWith('http')) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_VERSION).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match(event.request)
            .then((cachedResponse) => {
              return cachedResponse || caches.match('/offline.html');
            })
        })
    );
    return;
  }

  // Strategy 4: For non-GET requests (POST, PUT, etc.), always try network.
  // If offline, the browser will typically handle the error (e.g., show a network error page).
  // We don't cache non-GET requests.
  if (event.request.method !== 'GET') {
    event.respondWith(fetch(event.request).catch(() => {
        // Could return a specific error response if the app is designed to handle this
        // for non-GET requests when offline, but usually browser handles.
        // For now, let the browser default error occur.
        return new Response(JSON.stringify({ error: 'Offline', message: 'This action cannot be performed offline.' }), {
            headers: { 'Content-Type': 'application/json' },
            status: 503
          });
    }));
    return;
  }

  // Default: try network, then cache for anything else (less likely to be hit)
  event.respondWith(
    fetch(event.request)
      .catch(() => caches.match(event.request))
  );
});
