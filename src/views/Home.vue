<template>
  <div class="btn-div">
    <MDBBtn
      style="border: 3px solid rgba(0, 0, 0, 0.125)"
      color="dark"
      class="mb-4 floating-btn rounded-0"
      @click="setRandom"
      >Randomise</MDBBtn
    >
  </div>
    <img
      class="cocktailLogo"
      alt="cocktail database logo"
      src="../assets/watercolor-title.png"
    />
    <div style="max-width:1500px; margin: auto" class="homeDrinkCards">
    <!-- rows have one column, cards split equal width to fit 3, up to a breakpoint-->
    <!-- g-4 = grid gap of 4 -->
    <MDBRow :cols="['1', 'md-3']" class="g-4">
      <!-- cols col to each row-->

      <MDBCol v-for="item in randomCocktails" :key="item.idDrink">
        <MDBCard class="rounded-0 h-100" text="white" bg="dark">
          <MDBCardHeader style="border-width: 3px">
            <MDBCardTitle>{{ item.strDrink }}</MDBCardTitle>
          </MDBCardHeader>

          <router-link
            style="padding: 2px"
            :to="{ name: 'DrinkInfo', params: { id: item.idDrink } }"
            >Get Drink Info</router-link
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

          <MDBCardFooter class="text-muted">
            <li
              class="ingredientItem list-inline list-inline-item"
              v-for="item in getIngredients(item)"
              :key="item"
            >
              {{ item }}
            </li>
            <FavBtn v-if="currentUser" :drinkId="item.idDrink"/>
          </MDBCardFooter>
        </MDBCard>
      </MDBCol>
    </MDBRow>
    </div>
</template>
<script>
import { ref } from "vue";
import getAllCocktails from "../composables/fetchCocktails.js";
import FavBtn from "../components/FavBtn";
// import PageWrapper from "../components/PageWrapper";
import getUser from "../composables/getUser";
import {
  MDBBtn,
  MDBCard,
  MDBCardTitle,
  MDBCardImg,
  MDBCol,
  MDBRow,
  MDBCardFooter,
  MDBCardHeader,
} from "mdb-vue-ui-kit";
export default {
  name: "Home",
  components: {
    MDBCard,
    MDBCardTitle,
    MDBBtn,
    MDBCardImg,
    MDBCol,
    MDBRow,
    MDBCardFooter,
    MDBCardHeader,
    FavBtn,
    // PageWrapper
  },
  setup() {
    const randomCocktails = ref(null);
    const cocktailName = ref(null);
    const cocktailInst = ref(null);
    const cocktailImgSrc = ref(null);
    const exampleModal = ref(false);
    const ingredients = ref([]);
    const { allCocktails, fetchData, error } = getAllCocktails();
    const { currentUser } = getUser();

    const getCocktailByID = (cocktailObjArray, drinkID) => {
      const drink = cocktailObjArray.find(
        (element) => element.idDrink === drinkID
      );
      return drink;
    };

    const populateDrinkModal = (drinkID) => {
      const drinkObj = getCocktailByID(randomCocktails.value, drinkID);
      ingredients.value = getIngredients(drinkObj);
      cocktailName.value = drinkObj.strDrink;
      cocktailInst.value = drinkObj.strInstructions;
      cocktailImgSrc.value = drinkObj.strDrinkThumb;
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

    const getRandomCocktails = (n) => {
      const cocktails = allCocktails.value;
      let randomCocktails = [];
      for (let i = 0; i < n; i++) {
        randomCocktails = randomCocktails.concat(
          cocktails.splice(Math.random() * cocktails.length, 1)
        );
      }
      return randomCocktails;
    };

    const setRandom = () => {
      randomCocktails.value = getRandomCocktails(12);
      window.scrollTo(0, 0);
    };

    const populateCocktailData = async () => {
      await fetchData();
      setRandom();
    };

    const logItem = (item) => {
      console.log(item);
      return item;
    };

    populateCocktailData();

    return {
      allCocktails,
      cocktailName,
      cocktailInst,
      cocktailImgSrc,
      randomCocktails,
      setRandom,
      exampleModal,
      populateDrinkModal,
      getIngredients,
      ingredients,
      error,
      logItem,
      currentUser
    };
  },
};
</script>

<style>
.skeleton {
  animation: skele-load 1s linear infinite alternate;
}

@keyframes skele-load {
  0% {
    background-color: hsl(200, 20%, 70%);
  }
  100% {
    background-color: hsl(200, 20%, 95%);
  }
}



.floating-btn {
  margin: 0 auto;
  text-align: center;
  z-index: 999;
  border: 3px solid green;
}
.btn-div {
  width: 100vw;
  position: fixed;
  top: 70px;  /* relative to container (viewport) */
  left: 0px;  /* relative to container (viewport) */
  z-index: 999;
  height: 30px;
}

.drinkImg {
  opacity: 1;
  transition: 0.5s ease;
  backface-visibility: hidden;
}

.drinkImgContainer:hover .drinkImg {
  opacity: 0.6;
}

.cocktailLogo {
  width: 280px;
  max-height: 360px;
}

.ingredientItem {
  border: solid 1px;
  padding-left: 3px;
  padding-right: 3px;
  margin-bottom: 5px;
}
</style>
