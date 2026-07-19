const CACHE_NAME = 'kbli2025-ai-search-v1';

// Hanya aset statis milik aplikasi ini yang di-cache.
// Panggilan ke Firebase / API AI Agent SENGAJA tidak dicache
// agar data selalu real-time dan akurat.
const STATIC_ASSETS = [
  './',
  './index.html',
  './kbli-data.js',
  './manifest.json',
  'https://raw.githubusercontent.com/mlev99/sakahybrid/main/launchericon-144x144.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Jangan campur tangani request ke domain lain (Firebase RTDB, API AI,
  // CDN Bootstrap/Firebase SDK) — biarkan langsung ke jaringan / cache browser bawaan.
  if (url.origin !== self.location.origin){
    return;
  }

  // Aset statis milik app sendiri: cache-first, fallback ke jaringan.
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request).then((response) => {
        if (response && response.status === 200){
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => cached);
    })
  );
});
