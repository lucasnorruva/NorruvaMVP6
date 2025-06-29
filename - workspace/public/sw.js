const CACHE_NAME = "norruva-dpp-cache-v1.3"; // Incremented version
const OFFLINE_URL = "/offline.html";
const CORE_ASSETS = [
  "/",
  "/offline.html",
  "/manifest.json",
  "/favicon.ico",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  // Key CSS/JS bundles will be added by the build process or dynamically
  // For now, we'll rely on Next.js PWA plugins or manual additions if needed
  // For example, if you know main chunks:
  // '/_next/static/css/main.css', // Example, actual name will vary
  // '/_next/static/chunks/main-app.js', // Example
];

self.addEventListener("install", (event) => {
  console.log("[Service Worker] Install event in progress.");
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("[Service Worker] Caching core assets:", CORE_ASSETS);
        return cache.addAll(CORE_ASSETS);
      })
      .catch((error) => {
        console.error(
          "[Service Worker] Failed to cache core assets during install:",
          error,
        );
      }),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Activate event in progress.");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("[Service Worker] Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  // Only handle GET requests
  if (request.method !== "GET") {
    return;
  }

  // Strategy: Network first, then cache, then offline page for navigation requests
  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const networkResponse = await fetch(request);
          // If successful, cache the response (important for dynamic pages)
          const cache = await caches.open(CACHE_NAME);
          // Ensure we don't cache opaque responses or non-OK responses
          if (
            networkResponse &&
            networkResponse.ok &&
            networkResponse.type !== "opaque"
          ) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        } catch (error) {
          console.log(
            "[Service Worker] Network request failed, trying cache for:",
            request.url,
            error,
          );
          const cachedResponse = await caches.match(request);
          if (cachedResponse) {
            return cachedResponse;
          }
          // If both network and cache fail for navigation, show offline page
          console.log(
            "[Service Worker] Serving offline page for:",
            request.url,
          );
          const offlinePageCache = await caches.open(CACHE_NAME);
          const offlineResponse = await offlinePageCache.match(OFFLINE_URL);
          return (
            offlineResponse ||
            new Response("Offline fallback not found", {
              status: 404,
              headers: { "Content-Type": "text/plain" },
            })
          );
        }
      })(),
    );
  } else {
    // Strategy: Cache first, then network for static assets (or other non-navigation requests)
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          // console.log('[Service Worker] Serving from cache:', request.url);
          return cachedResponse;
        }
        // console.log('[Service Worker] Fetching from network:', request.url);
        return fetch(request)
          .then((networkResponse) => {
            // Optional: Cache new static assets if needed, but be careful with dynamic content
            // For example, cache only if it's from '/_next/static/' and is successful
            if (
              request.url.includes("/_next/static/") &&
              networkResponse &&
              networkResponse.ok &&
              networkResponse.type !== "opaque"
            ) {
              const cache = caches.open(CACHE_NAME);
              cache.then((c) => c.put(request, networkResponse.clone()));
            }
            return networkResponse;
          })
          .catch((error) => {
            console.warn(
              "[Service Worker] Fetch failed for non-navigation, no cache hit:",
              request.url,
              error,
            );
            // For non-navigation requests, we might not want to return the offline page,
            // but rather let the browser handle the error (e.g., broken image icon).
            // Or, you could return a generic error response for specific types if appropriate.
            // return new Response("Resource not available offline.", {status: 404, headers: {"Content-Type": "text/plain"}});
          });
      }),
    );
  }
});
