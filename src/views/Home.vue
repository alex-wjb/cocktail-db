<template>
  <!-- Randomise button -->
  <div class="btn-div">
    <MDBBtn
      style="border: 3px solid rgba(0, 0, 0, 0.125)"
      color="dark"
      class="mb-4 floating-btn rounded-0"
      @click="setRandom()"
      >Randomise</MDBBtn
    >
  </div>
  <!-- Site logo -->
  <img
    class="cocktailLogo"
    alt="cocktail database logo"
    src="../assets/watercolor-title.png"
  />

  <div v-if="error" class="fetchError">
    <div style="height: fit-content">
      <h4 class="errorTxt">Unable to retrieve cocktail data.</h4>
      <h4 class="errorTxt">Please try again later.</h4>
    </div>
  </div>

  <!-- Displayed Drinks -->
  <div class="drinkCardsContainer">
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
            <FavBtn v-if="currentUser" :drinkId="item.idDrink" />
          </MDBCardFooter>
        </MDBCard>
      </MDBCol>
    </MDBRow>
  </div>
</template>
<script>
import { ref } from "vue";
import getAllCocktails from "../composables/fetchCocktails.js";
import FavBtn from "../components/FavBtn.vue";
import getUser from "../composables/getUser";
import { onBeforeMount } from "vue";
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
  },
  setup() {
    const randomCocktails = ref(null);
    const { allCocktails, fetchData, error } = getAllCocktails();
    const { currentUser } = getUser();
    
    //returns list of all ingredients of a cocktail obj
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

    //returns array of n random cocktails
    const getRandomCocktails = (n) => {
      const cocktails = allCocktails.value;
      cocktails.forEach((ele)=>{console.log(ele.strDrink)})
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

    onBeforeMount(populateCocktailData);

    return {
      randomCocktails,
      setRandom,
      getIngredients,
      error,
      currentUser,
    };
  },
};
</script>

<style scoped>
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

.drinkCardsContainer {
  max-width: 1500px;
  margin: auto;
}

.fetchError {
  padding: 20px;
  background-color: grey;
  margin: 40px auto;
  width: fit-content;
  display: flex;
  align-items: center;
  height: 100px;
}

.errorTxt {
  width: fit-content;
  margin: auto;
}

.floating-btn {
  margin: 0 auto;
  text-align: center;
  z-index: 999;
}
.btn-div {
  width: 100vw;
  position: fixed;
  top: 70px; /* relative to container (viewport) */
  left: 0px; /* relative to container (viewport) */
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
