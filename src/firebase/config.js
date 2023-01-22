import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
//TODO: REPLACE WITH ENV VARIABLE
const firebaseConfig = {
  apiKey: "AIzaSyAZG2LM2_snWYXBoDCgBzAOb1UBHWUajsU",
  authDomain: "cocktails-search.firebaseapp.com",
  projectId: "cocktails-search",
  storageBucket: "cocktails-search.appspot.com",
  messagingSenderId: "11066493023",
  appId: "1:11066493023:web:5b3f79b28187c09813f3ea",
  measurementId: "G-814R61L3GP"
};

// apiKey: "AIzaSyASGLDaiOSvgnu7A89b5kgTfSmw7tMb73I",
// authDomain: "cocktail-db-74848.firebaseapp.com",
// projectId: "cocktail-db-74848",
// storageBucket: "cocktail-db-74848.appspot.com",
// messagingSenderId: "7793784973",
// appId: "1:7793784973:web:08453939a1fd7000efcac4",
// measurementId: "G-GDHXVC6K2P",
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);


//TODO: ADD COMMENT
enableIndexedDbPersistence(db)
  .catch((err) => {
      if (err.code == 'failed-precondition') {
          // Multiple tabs open, persistence can only be enabled
          // in one tab at a a time.
      } else if (err.code == 'unimplemented') {
          // The current browser does not support all of the
          // features required to enable persistence
      }
  });

export { auth, app, db };
