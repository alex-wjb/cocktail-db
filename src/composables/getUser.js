import { auth } from "../firebase/config.js";
import { onAuthStateChanged } from "firebase/auth";
import { ref } from "vue";

//null if no user logged in
//global state reactive value
const currentUser = ref(auth.currentUser);

//observer - callback triggers on log in/out
onAuthStateChanged(auth, (user) => {
  // console.log("Current user is:", user);
  currentUser.value = user;
});

//composable function
const getUser = () => {
  return { currentUser };
};

export default getUser;
