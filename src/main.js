import 'mdb-vue-ui-kit/css/mdb.min.css'; // must go first
import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";

createApp(App).use(router).mount("#app");


