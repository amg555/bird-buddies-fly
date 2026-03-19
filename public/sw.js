const CACHE_NAME = 'bird-buddies-v2';
const RUNTIME_CACHE = 'runtime-cache-v1';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Cache all game assets on first load
const GAME_ASSETS = [
  '/images/characters/aadi-sale.png',
  '/images/characters/basil.png',
  '/images/characters/dashamoolam.png',
  '/images/characters/davarayoli.png',
  '/images/characters/junglee-rummy.png',
  '/images/characters/lal.png',
  '/images/characters/Mukesh.png',
  '/images/characters/panuneer.png',
  '/images/characters/Pookkutti.png',
  '/images/characters/sura.png',
  '/sounds/actor1.mp3',
  '/sounds/actor2.mp3',
  '/sounds/actor3.mp3',
  '/sounds/actor4.mp3',
  '/sounds/actor5.mp3',
  '/sounds/actor6.mp3',
  '/sounds/actor7.mp3',
  '/sounds/actor8.mp3',
  '/sounds/actor9.mp3',
  '/sounds/actor10.mp3',
  '/sounds/hit.mp3',
  '/sounds/pass-through.mp3',
  '/sounds/pass.mp3'
];

self.addEventListener('install', event => {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS)),
      caches.open(RUNTIME_CACHE).then(cache => cache.addAll(GAME_ASSETS))
    ])
  );
  self.skipWaiting();
});

self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then(response => {
        // Don't cache non-successful responses
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }

        const responseToCache = response.clone();
        
        caches.open(RUNTIME_CACHE).then(cache => {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE)
          .map(cacheName => caches.delete(cacheName))
      );
    })
  );
  self.clients.claim();
});