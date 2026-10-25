/* Shell-only service worker.
   assets/ is deliberately never cached — it holds ~18 MB of music and photos. */
const VERSION = "lamin-shell-v1";
const scopePath = new URL(self.registration.scope).pathname;

const SHELL = [
  scopePath,
  scopePath + "index.html",
  scopePath + "404.html",
  scopePath + "manifest.json",
  scopePath + "css/style.css",
  scopePath + "css/panels.css",
  scopePath + "js/config.js",
  scopePath + "js/ui.js",
  scopePath + "js/profile.js",
  scopePath + "js/background.js",
  scopePath + "js/enter.js",
  scopePath + "js/snow.js",
  scopePath + "js/gallery.js",
  scopePath + "js/player.js",
  scopePath + "js/panels.js",
  scopePath + "js/terminal.js"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(VERSION)
      .then(c => c.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  if (url.pathname.startsWith(scopePath + "assets/")) return;

  if (req.mode === "navigate"){
    e.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(VERSION).then(c => c.put(scopePath + "index.html", copy));
        return res;
      }).catch(() => caches.match(scopePath + "index.html"))
    );
    return;
  }

  e.respondWith(
    caches.match(req).then(hit => {
      const fresh = fetch(req).then(res => {
        if (res.ok){
          const copy = res.clone();
          caches.open(VERSION).then(c => c.put(req, copy));
        }
        return res;
      }).catch(() => hit);
      return hit || fresh;
    })
  );
});
