<template>
  <div id="quizGame" class="quizGame pt-4 pb-4">
    <div v-if="showResults" style="height: 100vh" class="text-center">
      <div
        class="m-auto scoreCard rounded-1 p-3"
        style="
          height:200px;
          background-color: white;
          margin-top: 100px !important;
        "
      >
        <h4 class="d-block">You scored:</h4>
        <h4 cclass="d-block">{{ quizScore }} / 10</h4>
        <button
          class="btn btn-dark m-1"
          @click="(showResults = false), (quizActive = true), resetQuiz()"
        >
          Try again
        </button>
      </div>
    </div>
    <div
      v-if="quizLoaded"
      v-show="quizActive"
      class="card quizCard rounded-0 text-center"
    >
      <div
        class="card-header pt-1 pb-0 d-flex align-items-center justify-content-center flex-column"
        style="border-width: 0px;"
      >
        <!-- <div class="d-flex align-items-center flex-column mb-2">
          <div><h6 class="fw-bold">Game Mode</h6></div>
          <div>
            <button class="btn btn-dark m-1" @click="set10QMode">
              10 Questions
            </button>
            <button class="btn btn-dark m-1" @click="setStreakMode">
              Infinite (streak)
            </button>
          </div>
        </div> -->
        <!-- <div
          v-if="streakMode"
          class="d-flex justify-content-between w-100 mt-1"
        >
          <h6 class="fw-bold mb-0">Current Streak: {{ quizStreak }}</h6>
          <h6 class="fw-bold mb-0">Highest Streak: {{ highStreak }}</h6>
        </div> -->
      </div>

      <div class="card-body pt-1">
       
        <div
          class="drinkCard pt-2 pe-2 ps-2 mt-2 m-auto rounded-1"
          style="background-color: #212529"
        >
          <h3 class="card-title drinkTitle text-white mb-2">
            {{ displayedCocktail.strDrink }}
          </h3>
          <img
            class="rounded-0 drinkImg d-block mb-0"
            crossorigin="anonymous"
            :src="displayedCocktail.strDrinkThumb"
            :alt="displayedCocktail.strDrink"
          />

          <li
            class="list-inline-item rounded-1 fw-bold correctIngs mt-2 pe-1 ps-1"
            v-for="item in displayedCocktail.ingredients"
            :key="item"
          >
            {{ item }}
          </li>
        </div>
        <div v-if="tenQMode" class="d-flex justify-content-center w-100">
        <h5 class="fw-bold mb-1 mt-1">Question {{ questionCount }}</h5>
        </div>
        <h6 class="mt-2 fw-bold quizPrompt">Select the missing ingredient:</h6>

        <div class="mt-2">
          <div
            class="d-flex flex-column m-auto"
            v-for="item in ingredientOptions"
            :key="item"
          >
            <li
              class="rounded-1 w-50 m-auto mb-2 answerOptions p-2"
              @click="checkAnswer(item)"
              :id="item"
            >
              {{ item }}
            </li>
          </div>
        </div>

        <div class="mt-0 answerReveal" v-show="answerSelected">
          <span class="fw-bold" style="color: green" v-if="ansCorrect"
            >You are Correct!</span
          >
          <div class="fw-bold" v-else>
            <span  style="color: #800020">You are Wrong! </span
            ><span 
              > | Answer: {{ displayedCocktail.missingIng }}</span
            >
          </div>
        </div>
        <div style="height: 100px;">
        <button
          v-show="answerSelected"
          class="btn-dark btn rounded-1 mt-1 pt-1 pb-1"
          @click="loadQuestion(allCocktails)"
        >
          Next
        </button>
      </div>
      </div>
    </div>
  </div>
</template>
<script>
import { onBeforeMount, ref, watchEffect } from "vue";
import getAllCocktails from "../composables/fetchCocktails.js";
export default {
  setup() {
    const { allCocktails, fetchData, error } = getAllCocktails();
    const displayedCocktail = ref(null);
    const quizLoaded = ref(false);
    const ingredientOptions = ref(null);
    const allIngredients = ref(null);
    const answerSelected = ref(false);
    const ansCorrect = ref(false);
    const quizStreak = ref(0);
    const highStreak = ref(0);
    const quizScore = ref(0);
    const questionCount = ref(0);
    const streakMode = ref(false);
    const tenQMode = ref(true);
    const quizActive = ref(false);
    const showResults = ref(false);

    const loadQuiz = async () => {
      await fetchData();
      await fetchAllIngredients();
      allIngredients.value = await getAllIngredients();
      if (error.value) {
        console.log(error.value);
      }
      loadQuestion(allCocktails.value);
      quizActive.value = true;
    };

    onBeforeMount(loadQuiz);

    watchEffect(() => {
      if (questionCount.value === 11) {
        quizActive.value = false;
        showResults.value = true;
      }
    });

    const setStreakMode = () => {
      tenQMode.value = false;
      streakMode.value = true;
      quizScore.value = 0;
      loadQuestion(allCocktails.value);
    };
    const set10QMode = () => {
      tenQMode.value = true;
      streakMode.value = false;
      questionCount.value = 0;
      quizStreak.value = 0;
      loadQuestion(allCocktails.value);
    };

    const checkAnswer = (item) => {
      if (!answerSelected.value) {
        answerSelected.value = true;

        if (item === displayedCocktail.value.missingIng) {
          document.getElementById(item).style.backgroundColor = "green";

          ansCorrect.value = true;
          if (streakMode.value) {
            quizStreak.value++;
            if (quizStreak.value > highStreak.value) {
              highStreak.value = quizStreak.value;
            }
          }
          if (tenQMode.value) {
            quizScore.value++;
          }

          return;
        }
        document.getElementById(item).style.backgroundColor = "#800020";
        ansCorrect.value = false;
        if (streakMode.value) {
          quizStreak.value = 0;
        }
      }
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

    const resetQuiz = () => {
      quizScore.value = 0;
      questionCount.value = 1;
    };

    const loadQuestion = (cocktailObjArray) => {
      quizLoaded.value = false;
      answerSelected.value = false;
      questionCount.value++;
      // load cocktail
      displayedCocktail.value = getRandomCocktail(cocktailObjArray);

      //load displayed correct ingredients
      const correctIngredients = getIngredients(displayedCocktail.value);
      const randomIndex = Math.floor(Math.random() * correctIngredients.length);
      const missingIng = correctIngredients[randomIndex];
      correctIngredients.splice(randomIndex, 1, "? ? ?");
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
      ansCorrect,
      answerSelected,
      quizStreak,
      highStreak,
      tenQMode,
      streakMode,
      quizScore,
      questionCount,
      setStreakMode,
      set10QMode,
      quizActive,
      showResults,
      resetQuiz,
    };
  },
};
</script>
<style scoped>
.quizGame {
  /* max-width: 1000px; */
  width: 100%;
  margin: auto;
  height: 100vh;
  background-color: #212529;
  position: absolute;
  top: 45px;
  left: -50px;
  right: -50px;
  /* counterract parent pagewrapper padding */
}

.quizCard {
  max-width: 700px;
  margin: auto;
  height:100%;
  background-color: lightgrey;
  box-shadow: 0 4px 8px 0 rgb(0 0 0 / 20%), 0 6px 20px 0 rgb(0 0 0 / 19%);
}

.card-header {
  background-color: lightgrey;
}

.correct {
  background-color: green !important;
}
.drinkCard {
  width: 65%;
  padding-bottom: 10px !important;
}
.drinkImg {
  margin: auto;
  width: 100%;
  /* box-shadow: 0 4px 8px 0 rgb(0 0 0 / 20%), 0 6px 20px 0 rgb(0 0 0 / 19%); */
  /* border: 20px solid #212529; */
}

.correctIngs {
  background-color: #86d5b8;
}

.scoreCard{
  max-width: 300px;
}

.answerOptions {
  color: white;
  background-color: #212529;
  width: fit-content;
  list-style: none;
  cursor: pointer;
}

@media (max-width: 600px) {
  .drinkCard {
    width: 85%;
    min-height:320px;
  }
.answerReveal{
  font-size: 14px;
}
  .answerOptions {
    width: 85% !important;
    padding: 4px !important;
    font-size: 14px;
  }
  .correctIngs {
    font-size: 12px;
    margin-bottom: 0px !important;
    margin-top: 6px !important;
  }

  .quizPrompt{
    font-size: 14px;
  }

  .drinkTitle{
    font-size: 18px;
  }
  .drinkImg{
    width: 70%;
  }

  .quizGame{
    background-color: lightgrey;
  }

  .quizCard{
    box-shadow: none;
    border: none;
  }
}
</style>
