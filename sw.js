const CACHE_NAME = 'futura-relatorios-v1';
const STATIC_FILES = ['./', './index.html', './config.js', './manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(STATIC_FILES)).catch(() => {}));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  if (e.request.url.includes('script.google.com')) return;
  if (e.request.url.includes('fonts.googleapis.com')) return;
  e.respondWith(fetch(e.request).then(res => {
    const clone = res.clone();
    caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
    return res;
  }).catch(() => caches.match(e.request)));
});
