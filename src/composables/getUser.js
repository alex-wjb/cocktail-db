
import { auth } from '../firebase/config.js';
import { onAuthStateChanged } from 'firebase/auth';
import { ref } from 'vue';

//null if not logged in
const currentUser = ref(auth.currentUser);

//fires on log in / sign out
onAuthStateChanged(auth, (user) => {
  
  console.log('Current user is:', user)
  currentUser.value = user});

const getUser = () => {
  return  {currentUser} ;
};

export default getUser;