let log = (color, bg, msg) =>
  console.log("%c%s%s", `background:#${color};color:white;`, `${bg} `, msg);
let version = "delete";
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
      log("209cee", "activate", `delete ${key}`);
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
    log("209cee", "fetch", "cache first");
    evt.respondWith(caches.match(req));
  } else if (url.pathname in staleWhileRevalidate) {
    log("209cee", "fetch", "stale while revalidate");
    evt.respondWith(caches.match(evt.request));
    try {
      let resp = await fetch(evt.request);
      cache.put(evt.request, resp);
      log("209cee", "fetch", "cache update OK");
    } catch {}
  } else {
    log("209cee", "fetch", "network first");
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
