import { auth } from "../firebase/config.js";
import { onAuthStateChanged } from "firebase/auth";
import { ref } from "vue";

const currentUser = ref(auth.currentUser);

//event triggers on log in/out
onAuthStateChanged(auth, (user) => {
  console.log("Current user is:", user);
  currentUser.value = user;
});

const getUser = () => {
  return { currentUser };
};

export default getUser;
