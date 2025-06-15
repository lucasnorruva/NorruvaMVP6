// Service Worker for Norruva DPP Platform

const CACHE_NAME = 'norruva-dpp-cache-v2'; // Incremented cache version
const OFFLINE_URL = '/offline.html';

// Assets to cache on install
const CORE_ASSETS = [
  OFFLINE_URL,
  '/',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-384x384.png',
  '/icons/icon-512x512.png',
  // Add other critical static assets if known and stable, e.g., a logo font
  // Next.js handles its own JS/CSS chunk caching effectively, so be selective here.
];

self.addEventListener('install', (event) => {
  console.log('[Service Worker] Attempting to install service worker and cache static assets...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Opened cache:', CACHE_NAME);
        return cache.addAll(CORE_ASSETS);
      })
      .then(() => {
        console.log('[Service Worker] All core assets cached successfully.');
        return self.skipWaiting(); // Activate worker immediately
      })
      .catch(error => {
        console.error('[Service Worker] Caching failed during install:', error);
      })
  );
});

self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activate event in progress.');
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
    }).then(() => {
      console.log('[Service Worker] Activated and old caches cleaned.');
      return self.clients.claim(); // Ensure new SW takes control of all clients
    })
  );
});

self.addEventListener('fetch', (event) => {
  // Strategy: Network falling back to cache, then offline page for navigation
  if (event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const networkResponse = await fetch(event.request);
          return networkResponse;
        } catch (error) {
          console.log('[Service Worker] Network request failed for navigation, serving offline page:', event.request.url);
          const cache = await caches.open(CACHE_NAME);
          const cachedResponse = await cache.match(OFFLINE_URL);
          if (cachedResponse) {
            return cachedResponse;
          }
          // Fallback if offline.html itself isn't cached for some reason
          return new Response("<h1>Offline</h1><p>You appear to be offline and the requested page isn't available.</p>", {
            headers: { 'Content-Type': 'text/html' }
          });
        }
      })()
    );
  }
  // For other requests (assets like CSS, JS, images), use a cache-first strategy
  // if they were part of CORE_ASSETS or handled by Next.js specific caching.
  // This example is simple; more complex strategies (StaleWhileRevalidate) exist.
  else if (CORE_ASSETS.includes(new URL(event.request.url).pathname)) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return cachedResponse || fetch(event.request);
      })
    );
  }
  // Let other requests pass through (e.g., API calls, Next.js data fetches)
});
