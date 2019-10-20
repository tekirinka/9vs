const CACHE = "cache";

self.addEventListener("install", event => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then(cache =>
        cache.addAll([
          "/",
          "/app.js",
          "/app.css",
          "/sw-register.js",
          "/sw.js",
          "/fetch.js",
          "/mf.json"
        ])
      )
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", evt => {
  evt.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", function(evt) {
  if (evt.request.url in ["/home", "/group2", "/shedule"])
    evt.request.url = "/";
  evt.respondWith(networkOrCache(evt.request).catch(() => useFallback()));
});

function networkOrCache(req) {
  if (new URL(req.url).origin != location.origin) {
    return fetch(req);
  } else {
    return fetch(req)
      .then(res => (res.ok ? cacheAndReturn(req, res.clone()) : fromCache(req)))
      .catch(() => fromCache(req));
  }
}

function useFallback() {
  return Promise.resolve(
    caches.open(CACHE).then(cache => cache.match(new Request("/")))
  );
}

function fromCache(req) {
  return caches
    .open(CACHE)
    .then(cache =>
      cache.match(req).then(res => res || Promise.reject("no-match"))
    );
}

async function cacheAndReturn(req, res) {
  let cache = await caches.open(CACHE);
  await cache.put(req, res.clone());
  return res;
}
