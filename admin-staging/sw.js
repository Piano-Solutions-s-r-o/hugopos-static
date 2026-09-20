/*
 * Hugo Admin's deliberately small service worker.
 *
 * It only stores same-origin static assets. Navigation documents and every
 * /api request stay on the network so an installed app never serves stale
 * authenticated data or captures a session response in Cache Storage.
 */
const CACHE_NAME = 'hugo-admin-static-v1';
const PRECACHE_URLS = [
  '/manifest.webmanifest',
  '/favicon.svg',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

const STATIC_DESTINATIONS = new Set(['script', 'style', 'font', 'image', 'manifest']);

function isCacheableStaticRequest(request) {
  const url = new URL(request.url);
  return (
    request.method === 'GET'
    && url.origin === self.location.origin
    && !url.pathname.startsWith('/api/')
    && !request.headers.has('authorization')
    && STATIC_DESTINATIONS.has(request.destination)
  );
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys
        .filter((key) => key.startsWith('hugo-admin-static-') && key !== CACHE_NAME)
        .map((key) => caches.delete(key)),
    )),
  );
});

self.addEventListener('fetch', (event) => {
  if (!isCacheableStaticRequest(event.request)) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached;
      }

      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        const copy = response.clone();
        event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy)));
        return response;
      });
    }),
  );
});
