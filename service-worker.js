const CACHE_NAME = 'monprog-v4-2026-04-11-1';
const HTML_FALLBACK = './index.html';
const STATIC_ASSETS = [
  './manifest.json?v=20260411-1',
  './styles/main.css?v=20260411-1',
  './styles/components.css?v=20260411-1',
  './styles/animations.css?v=20260411-1',
  './js/config/firebase-config.js?v=20260411-1',
  './js/modules/validation.js?v=20260411-1',
  './js/modules/notifications.js?v=20260411-1',
  './js/modules/storage.js?v=20260411-1',
  './js/modules/firebase.js?v=20260411-1',
  './js/modules/ui.js?v=20260411-1',
  './js/modules/seriesTracker.js?v=20260411-1',
  './js/modules/exercises.js?v=20260411-1',
  './js/services/exerciseService.js?v=20260411-1',
  './js/services/syncService.js?v=20260411-1',
  './js/seed.js?v=20260411-1',
  './js/app.js?v=20260411-1',
  './assets/benchpress_illustration_1775427787141.png',
  './assets/bicep_curl.png',
  './assets/bird_dog.png',
  './assets/burpee.png',
  './assets/cat_arms.png',
  './assets/cat_back.png',
  './assets/cat_bras_1775428814769.png',
  './assets/cat_cardio.png',
  './assets/cat_cardio_1775428827460.png',
  './assets/cat_core.png',
  './assets/cat_core_1775428850418.png',
  './assets/cat_dos_1775428805135.png',
  './assets/cat_jambes_1775428794260.png',
  './assets/cat_legs.png',
  './assets/cat_mobilite_1775428838872.png',
  './assets/cat_mobility.png',
  './assets/deadlift_illustration_1775427773855.png',
  './assets/glute_bridge.png',
  './assets/hip_thrust.png',
  './assets/leg_press.png',
  './assets/media__1775427239516.png',
  './assets/plank_illustration_1775427797986.png',
  './assets/pullup.png',
  './assets/pushup.png',
  './assets/rowing_cable.png',
  './assets/squat_illustration_1775427762074.png',
  './assets/wall_sit.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

function isCacheable(response) {
  return response && (response.status === 200 || response.type === 'opaque');
}

async function networkFirstPage(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch(request);
    if (isCacheable(response)) {
      await cache.put(HTML_FALLBACK, response.clone());
    }
    return response;
  } catch (error) {
    const cachedPage = await cache.match(HTML_FALLBACK);
    if (cachedPage) return cachedPage;
    const cachedRequest = await cache.match(request);
    if (cachedRequest) return cachedRequest;
    throw error;
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  const networkPromise = fetch(request)
    .then(response => {
      if (isCacheable(response)) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => cached);

  return cached || networkPromise;
}

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  if (event.request.mode === 'navigate') {
    event.respondWith(networkFirstPage(event.request));
    return;
  }

  if (url.origin === self.location.origin) {
    event.respondWith(staleWhileRevalidate(event.request));
  }
});

