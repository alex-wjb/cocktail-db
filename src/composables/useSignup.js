import { auth } from "../firebase/config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref } from "vue";

const pending = ref(false);
const signupError = ref(null);

const signup = async (email, password) => {
  signupError.value = null;
  pending.value = true;

  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    if (!res) throw new Error("Sign Up Failed");

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

const useSignup = () => {
  return { signup, signupError, pending };
};

export default useSignup;
