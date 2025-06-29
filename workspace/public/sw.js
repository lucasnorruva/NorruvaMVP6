// Service Worker for Norruva DPP PWA

const CACHE_VERSION = "norruva-dpp-cache-v7"; // Incremented version
const CORE_ASSETS_TO_CACHE = [
  "/",
  "/offline.html",
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  // Next.js build artifacts will be added dynamically by the build process.
  // We will attempt to cache JS/CSS chunks during the install event if possible,
  // or rely on runtime caching for them.
];

// Install event: Cache core assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      .then((cache) => {
        console.log(
          "[ServiceWorker] Caching core assets:",
          CORE_ASSETS_TO_CACHE,
        );
        return cache.addAll(CORE_ASSETS_TO_CACHE);
      })
      .then(() => {
        console.log("[ServiceWorker] Core assets cached successfully.");
        return self.skipWaiting(); // Activate worker immediately
      })
      .catch((error) => {
        console.error(
          "[ServiceWorker] Failed to cache core assets during install:",
          error,
        );
      }),
  );
});

// Activate event: Clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_VERSION) {
              console.log("[ServiceWorker] Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
            return null;
          }),
        );
      })
      .then(() => {
        console.log("[ServiceWorker] Activated and old caches cleaned.");
        return self.clients.claim(); // Take control of all clients
      }),
  );
});

// Fetch event: Implement caching strategies
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // --- API Requests Caching Strategy (Network First, then Cache, then Offline JSON Error for GET) ---
  if (url.pathname.startsWith("/api/v1/")) {
    if (request.method === "GET") {
      event.respondWith(
        fetch(request)
          .then((networkResponse) => {
            // If successful network response, clone it, cache it, and return it
            if (networkResponse && networkResponse.ok) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_VERSION).then((cache) => {
                cache.put(request, responseToCache);
              });
            }
            return networkResponse;
          })
          .catch(() => {
            // Network failed, try to serve from cache
            return caches.match(request).then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // Not in cache, return a structured JSON error for API GETs
              const offlineErrorBody = {
                error: {
                  code: 503, // Service Unavailable
                  message:
                    "Network error. The requested API data is not available offline and could not be fetched from the cache.",
                },
              };
              return new Response(JSON.stringify(offlineErrorBody), {
                status: 503,
                statusText: "Service Unavailable (Offline)",
                headers: { "Content-Type": "application/json" },
              });
            });
          }),
      );
    } else {
      // For non-GET API requests (POST, PUT, etc.), try network only.
      // If offline, let the browser handle the error (e.g., "TypeError: Failed to fetch")
      // as we don't want to cache modifications or send stale data.
      event.respondWith(
        fetch(request).catch(() => {
          // For non-GET, it's better to fail clearly if offline than to return a generic error page,
          // as the app's logic for POST/PUT needs to handle the failure.
          // We can, however, return a JSON error to make it consistent if desired.
          const offlineErrorBody = {
            error: {
              code: 503, // Service Unavailable
              message: `Cannot perform ${request.method} operation while offline. Please check your connection.`,
            },
          };
          return new Response(JSON.stringify(offlineErrorBody), {
            status: 503,
            statusText: "Service Unavailable (Offline)",
            headers: { "Content-Type": "application/json" },
          });
        }),
      );
    }
    return; // API request handled
  }

  // --- Static Assets Caching Strategy (Cache First, then Network) ---
  // This primarily targets assets like CSS, JS chunks, images, fonts loaded from the same origin.
  if (
    CORE_ASSETS_TO_CACHE.includes(url.pathname) || // Core assets from install
    (url.origin === self.location.origin && // Same-origin assets
      (url.pathname.match(
        /\.(css|js|png|jpg|jpeg|svg|gif|woff|woff2|ttf|eot)$/,
      ) ||
        url.pathname.startsWith("/_next/static/"))) // Next.js static chunks
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.ok) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_VERSION).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return networkResponse;
        });
      }),
    );
    return; // Static asset handled
  }

  // --- Navigation Requests Caching Strategy (Network First, then Cache, then Offline HTML Fallback) ---
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // If successful network response, clone it, cache it, and return it
          if (response && response.ok) {
            const responseToCache = response.clone();
            caches.open(CACHE_VERSION).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // Network failed, try to serve from cache
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // Not in cache, serve the offline fallback page
            return caches.match("/offline.html");
          });
        }),
    );
    return; // Navigation request handled
  }

  // For other requests, just try to fetch from network (default browser behavior)
  // event.respondWith(fetch(request));
});

// Message event listener (optional, for PWA updates, etc.)
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
