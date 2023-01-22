<template>
  <div>
    <a @click="toggleFavourite" role="button">
      <i v-show="!favourited" class="fa-solid fa-heart fa-2xl" style="color: grey"></i>
      <i v-show="favourited" class="fa-solid fa-heart fa-2xl" style="color: #99250e"></i>
    </a>
  </div>
</template>

<script>
import { db } from "../firebase/config";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { onMounted, ref } from "vue";
import getUser from "../composables/getUser";
export default {
  props: ["drinkId"],
  setup(props) {
    const favourited = ref(false);
    const { currentUser } = getUser();
    const favourites = ref([]);

    onMounted(async () => {
      const docRef = doc(db, "users", currentUser.value.uid);
      const docSnap = await getDoc(docRef);
      console.log(currentUser.value.uid);

      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        favourites.value = docSnap.data().favourites;
        if (docSnap.data().favourites.includes(props.drinkId)) {
          favourited.value = true;
        }
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    });

    const toggleFavourite = async () => {
      favourited.value = !favourited.value;
     if(favourited.value){
       await addFavourite();
     }
     else{
       await removeFavourite();
     }
    };

    const addFavourite = async () => {
      const docRef = doc(db, "users", currentUser.value.uid);

      await updateDoc(docRef, {
        favourites: arrayUnion(props.drinkId)
      });
      favourited.value = true;
    }

      const removeFavourite = async () => {
      const docRef = doc(db, "users", currentUser.value.uid);

      await updateDoc(docRef, {
        favourites: arrayRemove(props.drinkId)
      });
      favourited.value = false;
    }

    return { favourited, toggleFavourite, addFavourite, removeFavourite };
  },
};
</script>

<style></style>
