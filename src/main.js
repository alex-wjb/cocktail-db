import "mdb-vue-ui-kit/css/mdb.min.css"; // must go first
import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";

import { auth } from "./firebase/config";
import { onAuthStateChanged } from "firebase/auth";

//vue instance
let app = null;

//checks firebase user state before vue app creation
onAuthStateChanged(auth, () => {
  if (!app) {
    //create an instance of the vue object, declare a root component and mount it in the DOM
    app = createApp(App).use(router).mount("#app");
  }
});
