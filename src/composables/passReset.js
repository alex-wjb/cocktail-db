import { auth } from '../firebase/config';
import { ref } from 'vue';
import { sendPasswordResetEmail, } from 'firebase/auth';

const actionCodeSettings = {
  //change to domain address of production site
  url: 'http://localhost:8080/'
};
const error = ref(null);
const isPending = ref(false);

const passReset = async(email) => {
  error.value = null;
  isPending.value = true;

  try {
    await sendPasswordResetEmail(auth, email, actionCodeSettings);
    isPending.value = false;
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
    isPending.value = false;
  }
};

//composable function
const usePassReset = () => {
  return { error, passReset, isPending };
};

export default usePassReset;