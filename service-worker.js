const CACHE_NAME = 'dia-de-muertos-cache-v1';
const urlsToCache = [
  '/',
  '/app_progre/manifest.json',
  '/app_progre/index.html',
  '/app_progre/service-worker.js',
  '/app_progre/imagenes/1.png',
  '/app_progre/imagenes/2.png',
  '/app_progre/imagenes/3.png',
  '/app_progre/imagenes/4.png',
  '/app_progre/imagenes/5.png',
  '/app_progre/imagenes/6.png',
  '/app_progre/imagenes/7.png',
  '/app_progre/imagenes/8.png',
  '/app_progre/imagenes/9.png',
  '/app_progre/imagenes/icon.png'
];


self.addEventListener('install', event => {
  console.log('Service Worker instalado');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  console.log('Solicitud fetch:', event.request.url);
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si la respuesta está en caché, la devolvemos
        if (response) {
          return response;
        }

        // Si no, hacemos la solicitud y manejamos las redirecciones
        return fetch(event.request)
          .then(fetchResponse => {
            if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
              return fetchResponse;
            }

            // Almacenamos la respuesta en caché antes de devolverla
            const responseToCache = fetchResponse.clone();
            caches.open(CACHE_NAME)
              .then(cache => cache.put(event.request, responseToCache));

            return fetchResponse;
          });
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

