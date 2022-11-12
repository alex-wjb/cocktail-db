import {
  precacheAndRoute,
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
} from "workbox-precaching";
import { NavigationRoute, registerRoute } from "workbox-routing";
import { CacheFirst, StaleWhileRevalidate } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";
import { clientsClaim, setCacheNameDetails } from "workbox-core";

precacheAndRoute(self.__WB_MANIFEST);

// workbox.setConfig({
//   debug: true,
// });
cleanupOutdatedCaches();
setCacheNameDetails({ prefix: "cocktail-db" });
//USED TO ALLOW SERVICE WORKER TO PERFORM RUNTIME CACHING WHEN FIRST REGISTERED WITHOUT FIRST RELOADING PAGE
self.addEventListener("activate", () => self.clients.claim());
clientsClaim();

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// This assumes /index.html has been precached.
const handler = createHandlerBoundToURL("/index.html");
const navigationRoute = new NavigationRoute(handler);
registerRoute(navigationRoute);

registerRoute(
  new RegExp("https://www.thecocktaildb.com/api/json/v2/(.*)"),
  new StaleWhileRevalidate({
    cacheName: "drinks",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 30,
        maxAgeSeconds: 60 * 60 * 24, //1 day
      }),
    ],
    method: "GET",
    cacheableResponse: { statuses: [0, 200] },
  })
);

registerRoute(
  new RegExp("https://use.fontawesome.com/releases/v5.15.1/css/all.css"),
  new CacheFirst({
    cacheName: "icons",
    plugins: [
      new ExpirationPlugin({
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
