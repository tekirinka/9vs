const CACHE = "min";

self.addEventListener("install", event => {
  event.waitUntil(
    caches
      .keys()
      .then(x => x.map(key => key != CACHE && caches.delete(key)))
      .then(_ => {
        caches
          .open(CACHE)
          .then(cache =>
            cache
              .addAll([
                "/",
                "/app.js",
                "/app.css",
                "/sw-register.js",
                "/sw.js",
                "/fetch.js",
                "/mf.json",
                "/assets/icon-192.png",
                "/assets/icon.png",
                "/assets/icon.svg",
                "/assets/loading.svg",
                "/vendor/picnic.min.css"
              ])
              .then(self.skipWaiting)
          );
      })
  );
});

self.addEventListener("activate", async evt => {
  evt.waitUntil(
    caches
      .keys()
      .then(x => x.map(key => key != CACHE && caches.delete(key)))
      .then(_ => {
        self.clients.claim();
      })
  );
});

self.addEventListener("fetch", function(evt) {
  if (evt.request.url in ["/home", "/group2", "/shedule"])
    evt.request.url = "/";
  evt.respondWith(networkOrCache(evt.request).catch(() => useFallback()));
});

async function networkOrCache(req) {
  if (new URL(req.url).origin != location.origin) {
    return fetch(req);
  } else {
    let res = await fetch(req);
    if (res.ok) {
      cacheRes(req, res.clone());
      return res;
    } else {
      fromCache(req);
    }
  }
}

function useFallback() {
  return caches.open(CACHE).then(cache => cache.match(new Request("/")));
}

function fromCache(req) {
  return caches
    .open(CACHE)
    .then(cache =>
      cache.match(req).then(res => res || Promise.reject("no-match"))
    );
}

async function cacheRes(req, res) {
  await caches.open(CACHE).then(cache => cache.put(req, res.clone()));
  return res;
}
