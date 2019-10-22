const CACHE = "path";
let CACHE_PROMISE;
async function cache() {
  if (!CACHE_PROMISE) CACHE_PROMISE = await caches.open(CACHE);
  return CACHE_PROMISE;
}

self.addEventListener("install", async event => {
  let c = await cache();
  await c.addAll([
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
  ]);
  evt.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", async evt => {
  let keys = await caches.keys();
  keys.map(key => key != CACHE && caches.delete(key));
  evt.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", evt => {
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

async function useFallback() {
  let c = await cache();
  return c.match(new Request("/"));
}

async function fromCache(req) {
  let c = await cache();
  return (await c.match(req)) || Promise.reject("no cache match");
}

async function cacheRes(req, res) {
  let c = await cache();
  c.put(req, res.clone());
  return res;
}
