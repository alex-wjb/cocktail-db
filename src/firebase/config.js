import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyASGLDaiOSvgnu7A89b5kgTfSmw7tMb73I",
  authDomain: "cocktail-db-74848.firebaseapp.com",
  projectId: "cocktail-db-74848",
  storageBucket: "cocktail-db-74848.appspot.com",
  messagingSenderId: "7793784973",
  appId: "1:7793784973:web:08453939a1fd7000efcac4",
  measurementId: "G-GDHXVC6K2P",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();

export { auth, app };
