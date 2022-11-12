<template>
  <div class="profileCard">
    <MDBCard class="rounded-0 h-100" text="white" bg="dark">
      <MDBCardHeader style="border-width: 0px !important">
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
        <h3 style="padding-top: 10px">{{ displayName }}</h3></MDBCardHeader
      >
      <MDBCardBody>
        <MDBCardTitle></MDBCardTitle>
        <MDBCardText> </MDBCardText>
        <MDBBtn
          @click="showCamera = true"
          class="rounded-0"
          color="dark"
          outline="light"
          style="border-color: grey !important"
          >Edit Photo</MDBBtn
        >
        <MDBBtn
          class="rounded-0"
          @click="populateFavourites()"
          color="dark"
          outline="light"
          style="border-color: grey !important"
          >View Favourites</MDBBtn
        >
      </MDBCardBody>
    </MDBCard>
  </div>

  <div
    v-if="cocktails"
    style="max-width: 1500px; margin: auto"
    class="favouriteCards"
    xl
  >
    <!-- rows have one column, cards split equal width to fit 3, up to a breakpoint-->
    <!-- g-4 = grid gap of 4 -->
    <MDBRow :cols="['1', 'md-4']" class="g-4">
      <!-- cols col to each row-->

      <MDBCol v-for="item in cocktails" :key="item.idDrink">
        <MDBCard class="rounded-0 h-100" text="white" bg="dark">
          <MDBCardHeader style="border-width: 0px !important">
            <MDBCardTitle>{{ item.strDrink }}</MDBCardTitle>
          </MDBCardHeader>
          <MDBCardBody style="padding: 0px !important">
            <!-- <router-link
                style="padding: 2px"
                :to="{ name: 'DrinkInfo', params: { id: item.idDrink } }"
                >Get Drink Info</router-link
              > -->
          </MDBCardBody>

          <MDBCardFooter
            class="text-muted"
            style="
              padding-left: 0px;
              padding-right: 0px;
              border-width: 0px !important;
            "
          >
            <router-link
              :to="{ name: 'DrinkInfo', params: { id: item.idDrink } }"
            >
              <a class="drinkImgContainer">
                <MDBCardImg
                  class="rounded-0 drinkImg skeleton"
                  bottom
                  v-bind:src="item.strDrinkThumb"
                  v-bind:alt="item.strDrink"
                />
              </a>
            </router-link>
            <!-- <li
                class="ingredientItem list-inline list-inline-item"
                v-for="item in getIngredients(item)"
                :key="item"
              >
                {{ item }}
              </li> -->
            <FavBtn
              style="padding-top: 15px"
              v-if="currentUser"
              :drinkId="item.idDrink"
            />
          </MDBCardFooter>
        </MDBCard>
      </MDBCol>
    </MDBRow>
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
import {
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBCardTitle,
  MDBCardText,
  MDBBtn,
  MDBCardImg,
  MDBCol,
  MDBRow,
  MDBCardFooter,
} from "mdb-vue-ui-kit";
export default {
  components: {
    MDBCard,
    MDBCardBody,
    MDBCardHeader,
    MDBCardTitle,
    MDBCardText,
    MDBBtn,
    MDBCardImg,
    MDBCol,
    MDBRow,
    MDBCardFooter,
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
      console.log(currentUser.value.uid);
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
      const apiKey = "9973533";
      const query = `lookup.php?i=${drinkId}`;
      const requestUrl = `${baseURL}/${apiKey}/${query}`;
      try {
        const response = await fetch(requestUrl);
        if (response.status !== 200) {
          throw new Error(response.status + " - Unable to fetch data.");
        }
        const responseJSON = await response.json();
        console.log(responseJSON);
        cocktail.value = responseJSON.drinks[0];
        cocktails.value.push(cocktail.value);
      } catch (e) {
        await fetchData();
        if (error.value) {
          return;
        }
        cocktail.value = getCocktailByID(allCocktails.value, drinkId);
        console.log(cocktail.value);
        cocktails.value.push(cocktail.value);
      }
    };

    const getCocktailByID = (cocktailObjArray, drinkID) => {
      console.log(drinkID);
      const drink = cocktailObjArray.find(
        (element) => element.idDrink === drinkID
      );
      console.log(drink);
      return drink;
    };

    onMounted(() => {
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
}

.profileCard {
  max-width: 500px;

  margin: 0 auto;
}

.favouriteCards {
  margin-top: 60px !important;
  max-width: 800px !important;
}
@media (max-width: 768px) {
  .favouriteCards {
    max-width: 500px !important;
  }
}
</style>
