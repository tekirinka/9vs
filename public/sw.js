const CACHE = "gh-pages";
let CACHE_PROMISE;
async function cache() {
  if (!CACHE_PROMISE) CACHE_PROMISE = await caches.open(CACHE);
  return CACHE_PROMISE;
}

self.addEventListener("install", async evt => {
  evt.waitUntil(
    cache()
      .then(c =>
        c.addAll([
          "/",
          "/app.js",
          "/app.css",
          "/sw.js",
          "/mf.json",
          "/assets/icon-192.png",
          "/assets/icon.png",
          "/assets/icon.svg",
          "/assets/loading.svg",
          "/vendor/picnic.min.css"
        ])
      )
      .then(self.skipWaiting())
  );
});

self.addEventListener("activate", async evt => {
  evt.waitUntil(
    caches
      .keys()
      .then(key => key.filter(key => key != CACHE))
      .then(key => caches.delete(key))
      .then(_ => self.clients.claim())
  );
});

self.addEventListener("fetch", evt =>
  evt.respondWith(networkOrCache(evt.request).catch(useFallback))
);

async function networkOrCache(req) {
  if (new URL(req.url).origin != location.origin) {
    return await fetch(req);
  } else {
    let res = await fetch(req);
    if (res.ok) {
      (await cache()).put(req, res.clone());
      return res;
    } else {
      return fromCache(req);
    }
  }
}

async function useFallback() {
  let c = await cache();
  return c.match(new Request("/"));
}

async function fromCache(req) {
  return cache()
    .then(c => c.match(req))
    .then(res => res || Promise.reject("no match"));
}

async function cacheRes(req, res) {
  let c = await cache();
  c.put(req, res.clone());
  return res;
}
