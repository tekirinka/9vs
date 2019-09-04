let version = "update";
let cacheFirst = [
  "/",
  "/sw-register.js",
  "/app.js",
  "/mf.json",
  ...["icon-192.png", "icon.png", "icon.svg", "loading.svg", "shed.png"].map(
    x => `/assets/${x}`
  ),
  "https://unpkg.com/picnic@6.5.0/picnic.min.css"
];
let staleWhileRevalidate = ["/app.css"];

this.addEventListener("install", evt => {
  self.skipWaiting();

  evt.waitUntil(
    caches.open(version).then(cache => {
      console.time("precaching");
      cache.addAll([...cacheFirst, ...staleWhileRevalidate]);
      console.timeEnd("precaching");
    })
  );
});

this.addEventListener("activate", async evt => {
  let keys = await caches.keys();

  for (key of keys) {
    if (key != version) {
      console.log(
        "activate",
        "background:#209CEE;color:white;",
        `delete ${key}`
      );
      caches.delete(key);
    }
  }
});

this.addEventListener("fetch", async evt => {
  console.group("fetch");

  let url = new URL(evt.request.url);
  console.dir({ url });
  let req = evt.request;

  console.time("cache open");
  let cache = caches.open(version);
  console.timeEnd("cache open");

  if (url.pathname in cacheFirst) {
    console.log("cache first");
    evt.respondWith(caches.match(req));
  } else if (url.pathname in staleWhileRevalidate) {
    console.log("stale while revalidate");
    evt.respondWith(caches.match(evt.request));
    try {
      let resp = await fetch(evt.request);
      cache.put(evt.request, resp);
      console.log("cache update OK");
    } catch {}
  } else {
    console.log("network first");
    evt.respondWith(
      fetch(req)
        .then(resp => {
          cache.put(req, resp.clone());
          return resp;
        })
        .catch(_ => caches.match(req))
    );
  }
  console.groupEnd("fetch");
});
