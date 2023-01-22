import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyAZG2LM2_snWYXBoDCgBzAOb1UBHWUajsU",
  authDomain: "cocktails-search.firebaseapp.com",
  projectId: "cocktails-search",
  storageBucket: "cocktails-search.appspot.com",
  messagingSenderId: "11066493023",
  appId: "1:11066493023:web:5b3f79b28187c09813f3ea",
  measurementId: "G-814R61L3GP"
};
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
