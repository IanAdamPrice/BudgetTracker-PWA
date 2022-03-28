const APP_PREFIX = 'BudgetTracker-';
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;

const FILES_TO_CACHE = [
    '/',
    './index.html',
    './css/styles.css',
    './js/index.js',
    './js/idb.js',
    './manifest.json',
    './icons/icon-512x512.png',
    './icons/icon-384x384.png',
    './icons/icon-192x192.png',
    './icons/icon-152x152.png',
    './icons/icon-144x144.png',
    './icons/icon-128x128.png',
    './icons/icon-96x96.png',
    './icons/icon-72x72.png',
    'https://cdn.jsdelivr.net/npm/chart.js@2.8.0'
];

self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open(CACHE_NAME)
          .then(cache => {
            console.log('installing cache : ' + CACHE_NAME);
            return cache.addAll(FILES_TO_CACHE)
        })
    )

    self.skipWaiting();
});

self.addEventListener('fetch', function(event) {
  if (event.request.url.includes("/api/")) {
    event.respondWith(
        caches.open(CACHE_NAME).then(cache => {
            return fetch(event.request)
                .then(response => {
                    if (response.status === 200) {
                        cache.put(event.request.url, response.clone());
                    }

                    return response;
                })
                .catch(err => {
                    return cache.match(event.request);
                });
        }).catch(err => console.log(err))
    );

    return;
}

event.respondWith(
    caches.match(event.request).then(function (response) {
        return response || fetch(event.request);
    })
);
});

self.addEventListener('activate', function(event) {
  console.log('this event triggers when the service worker activates');
  event.waitUntil(
      caches.keys()
        .then(keyList => {
          return Promise.all(keyList.map(key => {
            if (key !== CACHE_NAME) {
              console.log('[ServiceWorker] Removing old cache', key)
              return caches.delete(key)
            }
          }))
        })
        .then(() => self.clients.claim())
  )
})

