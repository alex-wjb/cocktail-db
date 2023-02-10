<template>
  <div class="profile">
    <div
      class="rounded-1 h-100 card bg-dark profileCard text-white text-center"
    >
      <div class="card-header profileHeader">
        <h3 class="mt-4 mb-4">{{ displayName }}</h3>
      </div>
      <div class="card-body">
        <img
          v-show="profilePicExists"
          ref="profilePic"
          class="profileImage img-fluid rounded-circle"
          alt="user profile picture"
        />
        <img
          class="profileImage image-fluid rounded-circle"
          v-show="!profilePicExists"
          alt="grey outline user profile picture placeholder"
          src="../assets/profile-placeholder.png"
        />

        <button
          @click="showCamera = true"
          class="rounded-1 btn btn-dark mt-3 mb-3"
          style="
            border-color: grey;
            margin: auto;
            display: block;
            border-width: 2px;
          "
          color="dark"
          outline="light"
        >
          Edit Photo
        </button>
      </div>
    </div>
  </div>
  <div class="text-center mt-4 mb-3">
    <h1 style="font-family: 'Pacifico'">Favourites</h1>
  </div>

  <div
    v-if="cocktails"
    style="max-width: 1500px; margin: auto"
    class="favouriteCards"
    xl
  >
    <!-- rows have one column, cards split equal width to fit 3, up to a breakpoint-->
    <!-- g-4 = grid gap of 4 -->
    <div class="row g-4">
      <!-- cols col to each row-->

      <div
        class="col-md-3 col-xl-2"
        v-for="item in cocktails"
        :key="item.idDrink"
      >
        <div
          class="rounded-1 card bg-dark text-white text-center h-100 border-0 favCard"
        >
          <div
            class="card-header"
            style="border-width: 0px !important; height: 70px"
          >
            <div class="card-title">{{ item.strDrink }}</div>
          </div>

          <router-link
            :to="{ name: 'drinks-id', params: { id: item.idDrink } }"
          >
            <a class="drinkImgContainer">
              <img
                class="rounded-0 card-img-bottom drinkImg skeleton"
                crossorigin="anonymous"
                v-bind:src="item.strDrinkThumb"
                v-bind:alt="item.strDrink"
                
              />
            </a>
          </router-link>

          <div
            class="text-muted card-footer"
            style="border-width: 0px !important"
          >
            <FavBtn
              style="padding-top: 15px"
              v-if="currentUser"
              :drinkId="item.idDrink"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  <Camera @photoUploaded="getProfilePic()" v-if="showCamera" />
</template>

<script>
import {
  getStorage,
  ref as storageRef,
  getDownloadURL,
} from "firebase/storage";

import getUser from "../composables/getUser";
import Camera from "../components/Camera.vue";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import getAllCocktails from "../composables/fetchCocktails.js";
import FavBtn from "../components/FavBtn.vue";

import { ref, onMounted } from "vue";
export default {
  components: {
    Camera,
    FavBtn,
  },
  setup() {
    const { currentUser } = getUser();
    const displayName = ref("");
    const video = ref(null);
    const showCamera = ref(false);
    const profilePic = ref(null);
    displayName.value = currentUser.value.displayName;
    const profilePicExists = ref(false);
    const favourites = ref([]);
    const cocktails = ref([]);
    const { allCocktails, fetchData, error } = getAllCocktails();

    const getProfilePic = () => {
      const user = currentUser.value.uid;
      const storage = getStorage();
      getDownloadURL(storageRef(storage, user + "/images/profile.png"))
        .then((url) => {
          const img = profilePic.value;
          console.log(img);
          img.setAttribute("src", url);
          profilePicExists.value = true;
        })
        .catch((error) => {
          profilePicExists.value = false;
          switch (error.code) {
            case "storage/object-not-found":
              console.log("File doesn't exist");

              break;
            case "storage/unauthorized":
              console.log(" User doesn't have permission to access the object");
              break;
            case "storage/canceled":
              console.log("User cancelled the upload");
              break;

            case "storage/unknown":
              console.log(
                "Unknown error occurred, inspect the server response"
              );
              break;
          }
        });
    };

    const getIngredients = (cocktailObj) => {
      let ingredients = [];
      for (let i = 1; i <= 15; i++) {
        let n = "strIngredient" + i;
        if (cocktailObj[n]) {
          ingredients.push(cocktailObj[n]);
        }
      }
      return ingredients;
    };
    const getFavourites = async () => {
      const docRef = doc(db, "users", currentUser.value.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        favourites.value = docSnap.data().favourites;
      } else {
        console.log("Document does not exist");
      }
    };

    const populateFavourites = async () => {
      await getFavourites();
      cocktails.value = [];
      await favourites.value.forEach(async (element) => {
        await populateCocktailData(element);
      });
    };

    const populateCocktailData = async (drinkId) => {
      const cocktail = ref(null);
      const baseURL = "https://www.thecocktaildb.com/api/json/v2";
      const apiKey = import.meta.env.VITE_API_KEY
        ? import.meta.env.VITE_API_KEY
        : 1;
      const query = `lookup.php?i=${drinkId}`;
      const requestUrl = `${baseURL}/${apiKey}/${query}`;
      try {
        const response = await fetch(requestUrl);
        if (response.status !== 200) {
          throw new Error(response.status + " - Unable to fetch data.");
        }
        const responseJSON = await response.json();
        cocktail.value = responseJSON.drinks[0];
        cocktails.value.push(cocktail.value);
      } catch (e) {
        await fetchData();
        if (error.value) {
          return;
        }
        cocktail.value = getCocktailByID(allCocktails.value, drinkId);
        cocktails.value.push(cocktail.value);
      }
    };

    const getCocktailByID = (cocktailObjArray, drinkID) => {
      const drink = cocktailObjArray.find(
        (element) => element.idDrink === drinkID
      );

      return drink;
    };

    onMounted(() => {
      populateFavourites();
      getProfilePic();
    });

    return {
      displayName,
      video,
      showCamera,
      profilePic,
      getProfilePic,
      profilePicExists,
      getFavourites,
      cocktails,
      currentUser,
      populateFavourites,
      getIngredients,
      favourites,
    };
  },
};
</script>

<style scoped>
.profilePage {
  background-color: lightgrey;
  min-height: 100vh;
  padding-top: 115px;
  width: 100%;
  overflow-x: hidden;
  padding-bottom: 25px;
  padding-left: 25px;
  padding-right: 25px;
}
.profileImage {
  height: 200px;
  width: 200px;
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);

  border: 6px solid rgba(0, 0, 0, 0.175);
}
.profileHeader {
  border-bottom: 5px solid rgba(0, 0, 0, 0.175) !important;

  background-color: rgba(0, 0, 0, 0.175);
}
.profile {
  max-width: 500px;

  margin: 0 auto;
}

.favCard {
  box-shadow: 0 4px 8px 0 rgb(0 0 0 / 20%), 0 6px 20px 0 rgb(0 0 0 / 19%);
}

.profileCard {
  box-shadow: 0 4px 8px 0 rgb(0 0 0 / 20%), 0 6px 20px 0 rgb(0 0 0 / 19%);
}

.favouriteCards {
  max-width: 1400px !important;
}
@media (max-width: 768px) {
  .favouriteCards {
    max-width: 500px !important;
  }
}

button:active {
  transform: scale(0.9);
}

/* no hover styling - bg same as no state */
button:hover {
  background-color: #212529;
}
/* Apply hover style on devices where hover behaves properly (hover style sticks on iphone safari) */
@media (hover: hover) {
  button:hover {
    background-color: #414551;
  }
}
</style>
