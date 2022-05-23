module.exports = {
  pwa: {
    name: "Cocktail Database",
    manifestOptions: {
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
    iconPaths: {
      maskicon: null,
      favicon32: "./img/icons/favicon-32x32.png",
      favicon16: "./img/icons/favicon-16x16.png",
      appleTouchIcon: "./img/icons/icon-152x152.png",
      msTileImage: "./img/icons/icon-144x144.png",
    },

    // configure the workbox plugin
    workboxPluginMode: "InjectManifest",
    workboxOptions: {
      swSrc: "src/service-worker.js",
    },
  },
};
