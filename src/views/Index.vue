<template>

  <div v-if="error" class="fetchError">
    <div style="height: fit-content">
      <h4 class="errorTxt">Unable to retrieve cocktail data.</h4>
      <h4 class="errorTxt">Please try again later.</h4>
    </div>
  </div>

  <!-- Displayed Drinks -->
  <div class="drinkCardsContainer">
  
      <div class="row row-cols-1 row-cols-md-3 g-4">

      <div class="col" v-for="item in randomCocktails" :key="item.idDrink">
        <div class="rounded-0 h-100 card text-white bg-dark">
          <div class="card-header" style="border-width: 0px; " >
            <h4 class="card-title ">{{ item.strDrink }}</h4>
          </div>

          <router-link
          class="drinkLink"
            style="padding: 10px"
            :to="{ name: 'drinks-id', params: { id: item.idDrink } }"
            >View Recipe</router-link
          >
          <router-link
            :to="{ name: 'drinks-id', params: { id: item.idDrink } }"
          >
            <a class="drinkImgContainer">
              <img
                class="rounded-0 card-img-bottom drinkImg skeleton"
                v-bind:src="item.strDrinkThumb"
                v-bind:alt="item.strDrink"
              />
            </a>
          </router-link>

          <div class="text-muted card-footer">
            <li
              class="ingredientItem list-inline list-inline-item"
              v-for="item in getIngredients(item)"
              :key="item"
            >
              {{ item }}
            </li>
            <FavBtn v-if="currentUser" :drinkId="item.idDrink" />
          </div>
        </div>
      </div>
      </div>
  </div>
</template>
<script>
import { ref } from "vue";
import getAllCocktails from "../composables/fetchCocktails.js";
import FavBtn from "../components/FavBtn.vue";
import getUser from "../composables/getUser";
import { onBeforeMount, watchEffect } from "vue";
import {
} from "mdb-vue-ui-kit";
export default {
  name: "Home",
  props: ['shuffle'],
  components: {
    FavBtn,
  },
  setup(props) {
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
    watchEffect(() => {
      if (randomCocktails.value && props.shuffle!==null) {

        setRandom();
    
      }
    });
 
    //returns array of n random cocktails
    const getRandomCocktails = (n) => {
      let randomNums = [];
      let randomCocktails = [];
      const cocktails = allCocktails.value;
      for (let i = 0; i < n; i++) {
        const num = Math.floor(Math.random() * allCocktails.value.length);

        if (!randomNums.includes(num)) {
          randomNums.push(num);
          randomCocktails.push(cocktails[num]);
        }
      }
      // alert(randomCocktails.length);
      return randomCocktails;
    };
    //   const getRandomCocktails = (n) => {

    //   const cocktails = allCocktails.value;
    //   let randomCocktails = [];
    //   for (let i = 0; i < n; i++) {
    //     randomCocktails = randomCocktails.concat(
    //       cocktails.splice(Math.random() * cocktails.length, 1)
    //     );
    //   }
    //   return randomCocktails;
    // };

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
  text-align: center;
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
  box-shadow: 20px !important;
  text-align: center;
  z-index: 3000;
  height: 55px;
  width: 100px;
  height: 100px;
  border-radius: 150px!important;
}
.btn-div {
  width: 100vw;
  position: fixed;
 
  width: fit-content;
  bottom: 0px; /* relative to container (viewport) */
  right: 10px;
  /* relative to container (viewport) */
  z-index: 3000;
 height: auto;
}

.drinkImg {
  opacity: 1;
  transition: 0.5s ease;
  backface-visibility: hidden;
}

/* .drinkImgContainer:hover .drinkImg {
  opacity: 0.8;
} */

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
.drinkLink:hover{
  background-color: #414551;
  color:white;
}
.drinkLink{
  color:grey;
  text-decoration: none;
  background-color: #0c0e10;
  
}
</style>
