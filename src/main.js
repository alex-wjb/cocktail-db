import 'mdb-vue-ui-kit/css/mdb.min.css'; // must go first
import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";

import { auth } from './firebase/config';
import { onAuthStateChanged } from 'firebase/auth'

let app = null;

onAuthStateChanged(auth, () =>{
  if(!app){
    app = createApp(App).use(router).mount("#app");
  }
} );




