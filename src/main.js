// import "mdb-vue-ui-kit/css/mdb.min.css"; // must go first
// Import custom CSS
// import "bootstrap/dist/css/bootstrap.min.css"


import './scss/styles.scss'
import "bootstrap"

// Import all of Bootstrap's JS
// eslint-disable-next-line no-unused-vars



import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createMetaManager } from 'vue-meta'

import { auth } from "./firebase/config";
import { onAuthStateChanged } from "firebase/auth";

//vue instance
let app = null;
const metaManager = createMetaManager();

//checks firebase user state before vue app creation
onAuthStateChanged(auth, () => {
  if (!app) {
    //create an instance of the vue object, declare a root component and mount it in the DOM
    app = createApp(App).use(router).use(metaManager).mount("#app");
    
  }
});
