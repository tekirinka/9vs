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

self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", function(event) {
  if (event.request.url in ["/home", "/group1", "/group2", "/shedule"])
    event.request.url = "/";
  // event.request.url = `/#${event.request.url.substr(0, 1)}`;
  event.respondWith(networkOrCache(event.request).catch(() => useFallback()));
});

function networkOrCache(request) {
  return fetch(request)
    .then(response => (response.ok ? response : fromCache(request)))
    .catch(() => fromCache(request));
}

function useFallback() {
  return Promise.resolve(
    caches.open(CACHE).then(cache => cache.match(new Request("/")))
  );
}

function fromCache(request) {
  return caches
    .open(CACHE)
    .then(cache =>
      cache
        .match(request)
        .then(matching => matching || Promise.reject("no-match"))
    );
}
