<template>
  <div class="quizGame pt-5 pb-5">
    <div v-if="quizLoaded" class="card drinkCard rounded-0 text-center">
      <div
        class="card-header d-flex align-items-center justify-content-center"
        style="border-width: 0px; min-height: 80px"
      >
        <h3 class="card-title">{{ displayedCocktail.strDrink }}</h3>
      </div>

      <div class="card-body">
        <img
          class="rounded-0 drinkImg d-block mb-4"
          :src="displayedCocktail.strDrinkThumb"
          :alt="displayedCocktail.strDrink"
        />

        <li
          class="list-inline-item rounded-1 correctIngs p-1"
          v-for="item in displayedCocktail.ingredients"
          :key="item"
        >
          {{ item }}
        </li>

        <h4 class="mt-3">Select the missing ingredient:</h4>
        {{ displayedCocktail.missingIng }}

        <div class="container">
          <div class="row row-cols-2">
            <div class="col" v-for="item in ingredientOptions" :key="item">
              <li
                class="rounded-1 m-auto mb-2 answerOptions p-1"
                @click="checkAnswer(item)"
              >
                {{ item }}
              </li>
            </div>
          </div>
        </div>
        <button class="btn-dark" @click="loadQuestion(allCocktails)">Next</button>
      </div>
    </div>
  </div>
</template>
<script>
import { onBeforeMount, ref } from "vue";
import getAllCocktails from "../composables/fetchCocktails.js";
export default {
  setup() {
    const { allCocktails, fetchData, error } = getAllCocktails();
    const displayedCocktail = ref(null);
    const quizLoaded = ref(false);
    const ingredientOptions = ref(null);
    const allIngredients = ref(null);

    const loadQuiz = async () => {
      await fetchData();
      await fetchAllIngredients();
      allIngredients.value = await getAllIngredients();
      if (error.value) {
        console.log(error.value);
      }
      loadQuestion(allCocktails.value);
    };

    onBeforeMount(loadQuiz);

    const checkAnswer = (item) => {
      if (item === displayedCocktail.value.missingIng) {
        return true;
      }
      return false;
    };

    const fetchAllIngredients = async () => {
      const baseURL = "https://www.thecocktaildb.com/api/json/v2";
      const apiKey = import.meta.env.VITE_API_KEY
        ? import.meta.env.VITE_API_KEY
        : 1;
      const query = "list.php?i=list";
      const requestUrl = `${baseURL}/${apiKey}/${query}`;
      try {
        const response = await fetch(requestUrl);
        if (response.status !== 200) {
          throw new Error(response.status + " - Unable to fetch ingredients.");
        }
        const responseJSON = await response.json();
        return responseJSON.drinks;
      } catch (error) {
        console.log(error);
      }
    };

    const getAllIngredients = async () => {
      const ingredientJSON = await fetchAllIngredients();
      const ingredients = ingredientJSON.map((element) => {
        return element.strIngredient1;
      });
      return ingredients;
    };

    const getIngredientOptions = (
      allIngredients,
      correctIngredients,
      missingIng
    ) => {
      let ingredientOptions = [missingIng];
      while (ingredientOptions.length !== 4) {
        const ing =
          allIngredients[Math.floor(Math.random() * allIngredients.length)];
        if (!correctIngredients.includes(ing)) {
          ingredientOptions.push(ing);
        }
      }
      return shuffleArray(ingredientOptions);
    };

    //fisher-yates algorithm
    const shuffleArray = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
      return array;
    };

    const loadQuestion = (cocktailObjArray) => {
      quizLoaded.value = false;
      // load cocktail
      displayedCocktail.value = getRandomCocktail(cocktailObjArray);

      //load displayed correct ingredients
      const correctIngredients = getIngredients(displayedCocktail.value);
      const randomIndex = Math.floor(Math.random() * correctIngredients.length);
      const missingIng = correctIngredients[randomIndex];
      correctIngredients.splice(randomIndex, 1, "???");
      displayedCocktail.value.ingredients = correctIngredients;

      //load ingredient answer options
      displayedCocktail.value.missingIng = missingIng;
      ingredientOptions.value = getIngredientOptions(
        allIngredients.value,
        correctIngredients,
        missingIng
      );

      quizLoaded.value = true;
    };

    const getRandomCocktail = (cocktailObjArray) => {
      return cocktailObjArray[
        Math.floor(Math.random() * cocktailObjArray.length)
      ];
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

    return {
      allCocktails,
      loadQuestion,
      displayedCocktail,
      quizLoaded,
      ingredientOptions,
      checkAnswer,
    };
  },
};
</script>
<style scoped>
.quizGame {
  max-width: 1000px;
  margin: auto;
  background-color: #212529;
}

.drinkCard {
  max-width: 700px;
  margin: auto;
  background-color: lightgrey;
}

.card-header {
  background-color: lightgrey;
}

.drinkImg {
  margin: auto;
  max-width: 300px;
  /* box-shadow: 0 4px 8px 0 rgb(0 0 0 / 20%), 0 6px 20px 0 rgb(0 0 0 / 19%); */
  border: 20px solid #212529;
}

.correctIngs {
  background-color: #86d5b8;
}

.answerOptions {
  color: white;
  background-color: #212529;
  width: fit-content;
  list-style: none;
  cursor: pointer;
}
</style>
