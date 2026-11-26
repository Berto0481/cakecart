// CakeCart offline support.
// Online: always fetch the newest files (so updates arrive complete). Offline: use the saved copy.
// Bump VERSION whenever the app changes.
const VERSION = "cakecart-v18";
const FILES = [
  "./", "index.html", "app.css", "app.js", "native.js", "defaults.js", "manifest.webmanifest",
  "icons/icon-192.png", "icons/icon-512.png", "icons/maskable-192.png", "icons/maskable-512.png",
  "icons/apple-touch-icon.png",
  "icons/cakes/apple-pie-slice.webp", "icons/cakes/blueberry-slice.webp", "icons/cakes/brownies-slice.webp", "icons/cakes/chocolate-slice.webp", "icons/cakes/cinnamon-roll-slice.webp", "icons/cakes/key-lime-slice.webp", "icons/cakes/new-york-slice.webp", "icons/cakes/oreo-slice.webp", "icons/cakes/peanut-butter-slice.webp", "icons/cakes/pumpkin-slice.webp", "icons/cakes/raspberry-slice.webp", "icons/cakes/regular-slice.webp", "icons/cakes/salted-caramel-slice.webp", "icons/cakes/strawberry-slice.webp", "icons/cakes/turtle-slice.webp",
  "icons/favicon.png", "icons/logo.png",
  "fonts/nunito-latin-400-normal.woff2", "fonts/nunito-latin-600-normal.woff2",
  "fonts/nunito-latin-700-normal.woff2", "fonts/nunito-latin-800-normal.woff2"
];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION)
    .then(c => Promise.all(FILES.map(f => fetch(f, {cache: "reload"}).then(r => r.ok && c.put(f, r)))))
    .then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;
  const isFont = url.pathname.includes("/fonts/") || url.pathname.includes("/icons/");
  e.respondWith(caches.open(VERSION).then(async cache => {
    if (isFont) { const hit = await cache.match(e.request, {ignoreSearch: true}); if (hit) return hit; }
    try {
      const r = await fetch(e.request, {cache: "no-cache"});
      if (r.ok) cache.put(e.request, r.clone());
      return r;
    } catch (err) {
      return (await cache.match(e.request, {ignoreSearch: true})) || (await cache.match("index.html"));
    }
  }));
});
