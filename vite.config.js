import legacy from "@vitejs/plugin-legacy";
import { defineConfig, loadEnv } from "vite";
import Pages from "vite-plugin-pages";
import vue from "@vitejs/plugin-vue";
import { VitePWA } from "vite-plugin-pwa";
import generateSitemap from "vite-plugin-pages-sitemap";
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const path = require("path");

//TODO: IMPORT FROM UTILITY FILE
//returns a promise resolving to an array of cocktails
const fetchCocktailsByChar = (char) => {
  const baseURL = "https://www.thecocktaildb.com/api/json/v2";
  const apiKey = process.env.VITE_API_KEY ? process.env.VITE_API_KEY : 1;

  const query = `search.php?f=${char}`;
  const requestUrl = `${baseURL}/${apiKey}/${query}`;
  const response = sendRequest(requestUrl);
  return response;
};

//sends Fetch API request returning results as json
const sendRequest = async (requestUrl) => {
  //returns promise containing response object on resolve
  try {
    const response = await fetch(requestUrl);
    if (response.status !== 200) {
      throw new Error(response.status + " - Unable to fetch data.");
    }
    const responseJSON = await response.json();
    return responseJSON;
  } catch (err) {
    //ADD SWITCH CASE FOR CUSTOM ERRORS
    return Promise.reject(err.message);
  }
};

const fetchData = async () => {
  //clear cocktails array
  let data = [];
  let cocktails = [];
  try {
    //resolve all promises to an array of cocktail arrays a-z
    data = await Promise.all(fetchCocktailsAZ());
    /* remove any null responses, convert all cocktail data
    / to single array*/
    data.forEach((element) => {
      if (element.drinks !== null) {
        cocktails = cocktails.concat(element.drinks);
      }
    });

    return cocktails;
  } catch (err) {
    console.log(err);
  }
};

//TODO: IMPORT FROM UTILITY FILE
//returns an array of promises
const fetchCocktailsAZ = () => {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  const charsAZ = Array.from(alphabet);
  return charsAZ.map(async (char) => {
    return fetchCocktailsByChar(char);
  });
};

export default ({ mode }) => {
  //allows use of vite env variables in this config file
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  // https://vitejs.dev/config/
  return defineConfig({
    plugins: [
      vue(),
      Pages({
        dirs: "src/views",
        onRoutesGenerated: async (routes) => {
          const cocktails = await fetchData();
          const dynamicRoutes = cocktails.map(
            (cocktail) => `/drinks/${cocktail.idDrink}`
          );
          generateSitemap({
            routes: [...routes, ...dynamicRoutes],
            hostname: "https://cocktaildb.app/",
            changefreq: "weekly",
            exclude: ["/login", "/register", "/reset", "/profile"],
          });
        },
      }),
      legacy({
        targets: ["defaults", "not IE 11"],
      }),
      VitePWA({
        mode: "development",
        injectManifest: {
          globPatterns: ['**/*.{js,css,html}', 'assets/*.{png,ttf,woff2}']
        },
        devOptions: {
          enabled: true,
          /* when using generateSW the PWA plugin will switch to classic */
          type: "module",
          navigateFallback: "index.html",
        },
        base: "",
        srcDir: "src",
        filename: "service-worker.js",
        // includeAssets: ['/assets/styles/*.ttf', '/assets/*.png','/img/*.png'],
        strategies: "injectManifest",
        manifest: {
          name: "Cocktail Database",
          short_name: "Cocktail Database",
          start_url: "./",
          display: "standalone",
          theme_color: "#4DBA87",
          icons: [
            {
              src: "./img/icons/icon-192x192.png",

              sizes: "192x192",

              type: "image/png",
            },

            {
              src: "./img/icons/icon-512x512.png",

              sizes: "512x512",

              type: "image/png",
            },

            {
              src: "./img/icons/icon-192x192.png",

              sizes: "192x192",

              type: "image/png",

              purpose: "maskable",
            },

            {
              src: "./img/icons/icon-512x512.png",

              sizes: "512x512",

              type: "image/png",

              purpose: "maskable",
            },
          ],
          appleMobileWebAppCapable: "yes",
          appleMobileWebAppStatusBarStyle: "black",
          iconPaths: {
            maskicon: null,
            favicon32: "./img/icons/favicon-32x32.png",
            favicon16: "./img/icons/favicon-16x16.png",
            appleTouchIcon: "./img/icons/icon-152x152.png",
            msTileImage: "./img/icons/icon-144x144.png",
          },
        },
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
        "~bootstrap": path.resolve(__dirname, "node_modules/bootstrap"),
      },
    },
  });
};
