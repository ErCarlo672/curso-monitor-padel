// Service worker mínimo: permite instalar el campus como app y abrirlo sin conexión.
const CACHE = 'wpa-20261022e';
const BASE = ['./', 'index.html', 'campus.html', 'styles.css?v=20261022h', 'config.js?v=20261022h', 'curso.js?v=20261022h', 'campus.js?v=20261022h', 'main.js?v=20261022h', 'assets/img/logo-light.webp'];

self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(BASE)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
// Red primero; si no hay conexión, lo que haya en caché.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(r => {
    const copy = r.clone();
    caches.open(CACHE).then(c => c.put(e.request, copy));
    return r;
  }).catch(() => caches.match(e.request)));
});
