import { auth } from "../firebase/config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref } from "vue";

const pending = ref(false);
const signupError = ref(null);

//creates firebase user email/pass auth entry
const signup = async (email, password) => {
  signupError.value = null;
  pending.value = true;

  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    if (!res) throw new Error("Sign Up Unsuccessful");

    signupError.value = null;
    pending.value = false;
  } catch (err) {
    switch (err.code) {
      case "auth/invalid-email":
        signupError.value = "Invalid email.";
        break;
      case "auth/email-already-in-use":
        signupError.value = "Email already in use.";
        break;
      case "auth/weak-password":
        signupError.value = "Password should be at least 6 characters.";
        break;
    }
    pending.value = false;
  }
};

//composable function
const useSignup = () => {
  return { signup, signupError, pending };
};

export default useSignup;
