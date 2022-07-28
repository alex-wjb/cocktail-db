/* eslint-disable no-undef */
/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

workbox.setConfig({
  debug: true,
});

workbox.core.setCacheNameDetails({ prefix: "cocktail-db" });
//USED TO ALLOW SERVICE WORKER TO PERFORM RUNTIME CACHING WHEN FIRST REGISTERED WITHOUT FIRST RELOADING PAGE
self.addEventListener("activate", () => self.clients.claim());
workbox.core.clientsClaim();

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
workbox.routing.registerNavigationRoute(
  workbox.precaching.getCacheKeyForURL("index.html")
);

workbox.routing.registerRoute(
  new RegExp("https://www.thecocktaildb.com/api/json/v2/(.*)"),
  workbox.strategies.staleWhileRevalidate({
    cacheName: "drinks",
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 30,
        maxAgeSeconds: 60 * 60 * 24 //1 day
      }),
    ],
    method: "GET",
    cacheableResponse: { statuses: [0, 200] },
  })
);

workbox.routing.registerRoute(
  new RegExp("https://use.fontawesome.com/releases/v5.15.1/css/all.css"),
  workbox.strategies.cacheFirst({
    cacheName: "icons",
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 30,
        maxAgeSeconds: 60 * 60 * 24 * 30, //30 days
      }),
    ],
    method: "GET",
    cacheableResponse: { statuses: [0, 200] },
  })
);

const baseURL = "https://www.thecocktaildb.com/api/json/v2";
const apiKey = "9973533";
const alphabet = "abcdefghijklmnopqrstuvwxyz";
const charsAZ = Array.from(alphabet);
const requestUrls = charsAZ.map((char) => {
  const query = `search.php?f=${char}`;
  const url = `${baseURL}/${apiKey}/${query}`;
  return url;
});

const addResourcesToCache = async (resources, cacheName) => {
  const cache = await caches.open(cacheName);
  await cache.addAll(resources);
};

self.addEventListener("install", (evt) => {
  evt.waitUntil(
    addResourcesToCache(requestUrls, "drinks").then(
      console.log("Drink api responses precached.")
    )
  );
});

self.addEventListener("install", (evt) => {
  evt.waitUntil(
    addResourcesToCache(
      ["https://use.fontawesome.com/relea" + "ses/v5.15.1/css/all.css"],
      "icons"
    ).then(console.log("Icons precached."))
  );
});
