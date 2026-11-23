// CakeCart offline support: serve from cache, refresh in the background.
// Bump VERSION whenever recipes, prices or the app change.
const VERSION = "cakecart-v4";
const FILES = [
  "./", "index.html", "app.css", "app.js", "defaults.js", "manifest.webmanifest",
  "icons/icon-192.png", "icons/icon-512.png", "icons/maskable-192.png", "icons/maskable-512.png",
  "icons/apple-touch-icon.png", "icons/favicon.png", "icons/logo.png",
  "fonts/nunito-latin-400-normal.woff2", "fonts/nunito-latin-600-normal.woff2",
  "fonts/nunito-latin-700-normal.woff2", "fonts/nunito-latin-800-normal.woff2"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(caches.open(VERSION).then(async cache => {
    const hit = await cache.match(e.request, {ignoreSearch: true});
    const net = fetch(e.request).then(r => { if (r.ok) cache.put(e.request, r.clone()); return r; }).catch(() => null);
    return hit || (await net) || cache.match("index.html");
  }));
});
