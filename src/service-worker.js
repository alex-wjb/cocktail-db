import {
  precacheAndRoute,
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
} from "workbox-precaching";
import { NavigationRoute, registerRoute } from "workbox-routing";
import { CacheFirst, StaleWhileRevalidate, NetworkOnly } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";
import { clientsClaim, setCacheNameDetails } from "workbox-core";

precacheAndRoute(self.__WB_MANIFEST || []);

//hides sw console logs
self.__WB_DISABLE_DEV_LOGS = true;

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

//RUNTIME CACHING
//cache cocktail data
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
    cacheableResponse: { statuses: [200] },
  })
);

const url = "https://www.thecocktaildb.com/api/json/v2/" + (import.meta.env.VITE_API_KEY ? import.meta.env.VITE_API_KEY : 1) + "/randomselection.php";
registerRoute(url, new NetworkOnly());

//cache cocktail images
registerRoute(
  new RegExp("https://www.thecocktaildb.com/images/media/drink/(.*)"),
  async ({ url, event }) => {
    const staleWhileRevalidate = new StaleWhileRevalidate();
    //image already added to precache via glob patterns set in vite pwa config
    const placeholderImageURL = "./img/placeholder-img.png";

    try {
      const response =
        (await caches.match(event.request)) ||
        (await fetch(url, { method: "GET" }));
      if (!response || response.status === 404) {
        throw new Error(response.status);
      } else {
        return await staleWhileRevalidate.handle(event);
      }
      //serve placeholder img if no cockail img available
    } catch (error) {
      console.log(error);
      console.warn(
        `\nServiceWorker: Image [${url.href}] was not found either in the network or the cache. Responding with placeholder image instead.\n`
      );
      // * get placeholder image from precache || get placeholder image from network
      return (
        (await caches.match(placeholderImageURL)) ||
        (await fetch(placeholderImageURL, { method: "GET" }))
      );
    }
  }
);

//add all cocktail data to cache on service worker first install
self.addEventListener("install", (evt) => {
  evt.waitUntil(
    addResourcesToCache(getDrinkRequestUrls(), "drinks").then(
      console.log("Drink api responses precached.")
    )
  );
});

const getDrinkRequestUrls = () => {
  const baseURL = "https://www.thecocktaildb.com/api/json/v2";
  const apiKey = (import.meta.env.VITE_API_KEY ? import.meta.env.VITE_API_KEY : 1);
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  const charsAZ = Array.from(alphabet);
  const requestUrls = charsAZ.map((char) => {
    const query = `search.php?f=${char}`;
    const url = `${baseURL}/${apiKey}/${query}`;
    return url;
  });
  return requestUrls;
};

const addResourcesToCache = async (resources, cacheName) => {
  console.log("YO");
  const cache = await caches.open(cacheName);
  await cache.addAll(resources);
};
