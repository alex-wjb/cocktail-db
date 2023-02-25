<template>
  <div v-if="error" class="fetchError">
    <div style="height: fit-content">
      <h4 class="errorTxt">Unable to retrieve cocktail data.</h4>
      <h4 class="errorTxt">Please try again later.</h4>
    </div>
  </div>

  <!-- Displayed Drinks -->
  <div class="drinkCardsContainer">
    <div class="row g-4">
      <div
        class="col-sm-6 col-md-6 col-lg-4 col-xl-3 cardCols"
        v-for="item in randomCocktails"
        :key="item.idDrink"
      >
        <div
          class="rounded-0 h-100 card text-white bg-dark drinkCard rounded-1"
        >
          <div
            class="card-header d-flex align-items-center justify-content-center"
            style="border-width: 0px; min-height: 80px"
          >
            <h4 class="card-title">{{ item.strDrink }}</h4>
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
              <!-- <svg
                class="bd-placeholder-img card-img-bottom rounded-0 drinkImg"
                width="700px"
                height="350px"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-label="Placeholder"
                preserveAspectRatio="meet"
                focusable="false"
              >
                <title>Placeholder</title>
                <rect width="100%" height="100%" fill="#868e96"></rect>
              </svg> -->
              <img
                v-show="item.loading"
                src="../assets/loading.png"
                alt="placholder image"
                class="rounded-0 card-img-bottom drinkImg"
              />

              <img
                v-show="!item.loading"
                class="rounded-0 card-img-bottom drinkImg"
                crossorigin="anonymous"
                v-bind:src="item.strDrinkThumb"
                v-bind:alt="item.strDrink"
                @load="item.loading = false"
              />
            </a>
          </router-link>

          <div class="text-muted card-footer" style="height: 100%">
            <li
              class="ingredientItem list-inline list-inline-item rounded-0"
              v-for="item in getIngredients(item)"
              :key="item"
            >
              {{ item }}
            </li>
          </div>
          <FavBtn class="mb-3" v-if="currentUser" :drinkId="item.idDrink" />
        </div>
      </div>
    </div>

    <div
      v-if="randomCocktails"
      class="mobileViewShuffle m-auto mt-3 mb-0"
      style="display: block"
    >
      <button class="rounded-3 shuffleBtn p-2" @click="setRandom">
        <div class="shuffleIcon">
          <h2 style="margin: 0">
            <i class="fa-solid fa-shuffle fa-lg"></i>
          </h2>
          <p class="fw-bold mb-0">Shuffle</p>
        </div>
      </button>
    </div>
  </div>
</template>
<script>
import { ref } from "vue";
import getAllCocktails from "../composables/fetchCocktails.js";
import FavBtn from "../components/FavBtn.vue";
import getUser from "../composables/getUser";
import { onBeforeMount, watch } from "vue";
import { onBeforeRouteLeave } from "vue-router";

export default {
  name: "Home",
  props: ["shuffle"],
  emits: ["resetRandom"],
  components: {
    FavBtn,
  },
  setup(props, context) {
    const randomCocktails = ref(null);
    const { allCocktails, fetchData, error } = getAllCocktails();
    const { currentUser } = getUser();
    const populateCocktailData = async () => {
      try {
        const cocktails = [];
        const cocktailsAdded = [];
        while (cocktails.length < 12) {
          const drinks = await fetchRandomCocktails();
          for (let drink of drinks) {
            if (!cocktailsAdded.includes(drink.idDrink)) {
              cocktailsAdded.push(drink.idDrink);
              cocktails.push(drink);
              if (cocktails.length === 12) break;
             }
          };
        }
        setRandom(cocktails);
      } catch (err) {
        //API random call failed
        console.log(err);
        if (!allCocktails.value) {
          await fetchData();
        }
        setRandom(getRandomCocktails(12));
      }
    };

    onBeforeMount(populateCocktailData);

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
      let randomNums = [];
      let randomCocktails = [];
      const cocktails = allCocktails.value;
      // gets 12 unique random cocktail objects
      while (randomNums.length !== n) {
        const index = Math.floor(Math.random() * allCocktails.value.length);

        if (!randomNums.includes(index)) {
          randomNums.push(index);
          let cocktail = cocktails[index];
          cocktail.loading = true;
          randomCocktails.push(cocktail);
        }
      }
      return randomCocktails;
    };

    const fetchRandomCocktails = async () => {
      const baseURL = "https://www.thecocktaildb.com/api/json/v2";
      const apiKey = import.meta.env.VITE_API_KEY
        ? import.meta.env.VITE_API_KEY
        : 1;
      const query = `randomselection.php`;
      const requestUrl = `${baseURL}/${apiKey}/${query}`;

      const response = await fetch(requestUrl);
      if (response.status !== 200) {
        throw new Error(response.status + " - Unable to fetch data.");
      }
      const responseJSON = await response.json();
      return responseJSON.drinks;
    };

    const setRandom = (cocktailObjArray) => {
      randomCocktails.value = cocktailObjArray;
      window.scroll({
        top: 0,
        left: 0,
        behavior: "instant",
      });
    };

    //shuffle cocktails when shuffle button is pressed
    watch(
      () => props.shuffle,
      () => {
        if (randomCocktails.value && props.shuffle !== null) {
          populateCocktailData();
        }
      }
    );

    onBeforeRouteLeave((to, from) => {
      if (from.name === "Index") {
        //resets shuffle prop of this component to null
        context.emit("resetRandom");
      }
    });

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
  max-width: 1400px;
  /* 1300 */
  margin: auto;
  text-align: center;
  position: relative;
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
  border-radius: 150px !important;
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

.cocktailLogo {
  width: 280px;
  max-height: 360px;
}

.ingredientItem {
  border: solid 1px;
  padding-left: 3px;
  padding-right: 3px;
  margin-bottom: 5px;
  color: grey;
}

.drinkLink:hover {
  background-color: #414551;
  color: white;
}
.drinkLink {
  color: grey;
  text-decoration: none;
  background-color: #0c0e10;
}
.drinkCard {
  box-shadow: 0 4px 8px 0 rgb(0 0 0 / 20%), 0 6px 20px 0 rgb(0 0 0 / 19%);
  border: none;
}
.mobileViewShuffle {
  visibility: hidden;
  display: none !important;
}

.shuffleBtn {
  border: none;
  background-color: #86d5b8;
  color: black;
}
.shuffleBtn:hover {
  color: black;
  background-color: #86d5b8;
}
.shuffleBtn:active {
  border: none !important;
}
.shuffleBtn:active {
  /* transform: scale(0.9); */
  background-color: #86d5b8;
}

.mobileViewShuffle:active {
  transform: scale(0.9);
}

/* if device supports proper hover behaviour */
@media (hover: hover) {
  .shuffleBtn:hover {
    background-color: #69cbb0;
  }
}

@media (max-width: 575px) {
  .mobileViewShuffle {
    visibility: visible;

    display: block !important;
    margin: auto;
  }
}

@media (max-height: 400px) {
  .cardCols {
    flex: 0 0 auto !important;
    width: 33.33333333% !important;
  }
  .card-title {
    font-size: large;
  }
}
</style>
