const CACHE_NAME = 'norruva-dpp-cache-v1';
const STATIC_ASSETS = [
  '/openapi.yaml',
  '/favicon.ico',
  '/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    ))
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  if (url.pathname.startsWith('/passport/')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          const respClone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, respClone));
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  if (url.pathname === '/openapi.yaml' || request.destination === 'image') {
    event.respondWith(
      caches.match(request).then(cached => {
        return cached || fetch(request).then(resp => {
          const respClone = resp.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, respClone));
          return resp;
        });
      })
    );
  }
});
