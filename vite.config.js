import legacy from "@vitejs/plugin-legacy";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { VitePWA } from "vite-plugin-pwa"
const path = require('path')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    legacy({
      targets: ["defaults", "not IE 11"],
    }),
    VitePWA({
      mode: "development",
      devOptions: {
        enabled: process.env.SW_DEV === 'true',
        /* when using generateSW the PWA plugin will switch to classic */
        type: 'module',
        navigateFallback: 'index.html',
      },
      base: "/",
      srcDir: "src",
      filename: "service-worker.js",
      includeAssets: ["/favicon.png"],
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
      "@": path.resolve(__dirname, "./src"),
    },
  },
});

