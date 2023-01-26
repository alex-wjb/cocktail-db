import {
  precacheAndRoute,
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
} from "workbox-precaching";
import { NavigationRoute, registerRoute,} from "workbox-routing";
import { CacheFirst, StaleWhileRevalidate } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";
import { clientsClaim, setCacheNameDetails } from "workbox-core";

//hides sw console logs
self.__WB_DISABLE_DEV_LOGS = true;
const placeholderImageURL = './img/placeholder-img.png';
const logoURL = './assets/watercolor-title.png'

precacheAndRoute(
  (self.__WB_MANIFEST || []).concat([ placeholderImageURL ])
);



// workbox.setConfig({
//   debug: true,
// });
// cleanupOutdatedCaches();
setCacheNameDetails({ prefix: "cocktail-db" });
//USED TO ALLOW SERVICE WORKER TO PERFORM RUNTIME CACHING WHEN FIRST REGISTERED WITHOUT FIRST RELOADING PAGE
self.addEventListener("activate", () => self.clients.claim());
// clientsClaim();

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

// registerRoute(
//   new RegExp("https://www.thecocktaildb.com/images/media/drink/(.*)"),
//   async ({url, event}) => {
//     const staleWhileRevalidate = new StaleWhileRevalidate();

//     try {
//       const response = await caches.match(event.request) || await fetch(url, { method: 'GET' });
//       if (!response || response.status === 404) {
//         throw new Error(response.status);
//       } else {
//         return await staleWhileRevalidate.handle(event);
//       }

//     } catch (error) {
//       console.log(error);
//       console.warn(`\nServiceWorker: Image [${url.href}] was not found either in the network or the cache. Responding with placeholder image instead.\n`);
//       // * get placeholder image from cache || get placeholder image from network
//       return await caches.match(placeholderImageURL) || await fetch(placeholderImageURL, { method: 'GET' });

//     }
//   }
// );


registerRoute(
  new RegExp("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/(.*)"),
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

// registerRoute(
//   new RegExp("https://fonts.googleapis.com/(.*)"),
//   new CacheFirst({
//     cacheName: "fonts",
//     plugins: [
//       new ExpirationPlugin({
//         maxEntries: 30,
//         maxAgeSeconds: 60 * 60 * 24 * 30, //30 days
//       }),
//     ],
//     method: "GET",
//     cacheableResponse: { statuses: [0, 200] },
//   })
// );

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
