import { auth } from '../firebase/config';
import { ref } from 'vue';
import { sendPasswordResetEmail, } from 'firebase/auth';

//reactive values with global state
const error = ref(null);
const pending = ref(false);

const passReset = async(email) => {
  error.value = null;
  pending.value = true;

  try {
    await sendPasswordResetEmail(auth, email);
    pending.value = false;
  } catch (err) {
    console.error(err.message);
    switch (err.code) {
      case 'auth/invalid-email':
         error.value = 'Invalid email.';
         break;
      case 'auth/user-not-found':
        error.value = 'No account with that email was found.';
        break;
      case 'auth/wrong-password':
        error.value = 'Incorrect password.';
        break;
      }
      pending.value = false;
  }
};

//composable function
const usePassReset = () => {
  return { error, passReset, pending };
};

export default usePassReset;