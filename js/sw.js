wburl = 'https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js';
importScripts(wburl);

workbox.precaching.precacheAndRoute([
  '/',
  wburl
]);

workbox.routing.registerRoute(
  /\.(js|css)$/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'static',
  }),
);

workbox.routing.registerRoute(
  /\.(ico|png|jpeg|jpg)$/,
  new workbox.strategies.CacheFirst({
    cacheName: 'images',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
    ],
  }),
); // cache images for 30 days
