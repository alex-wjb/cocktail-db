<template>
  <component
    :is="'script'"
    v-if="cocktail"
    v-html="generateJsonld"
    type="application/ld+json"
  ></component>
  <div v-if="error" class="fetchError">
    <div style="height: fit-content">
      <h4 class="errorTxt">Unable to retrieve cocktail data.</h4>
      <h4 class="errorTxt">Please try again later.</h4>
    </div>
  </div>
  <router-link
    style="width: 150px"
    :to="{ name: 'Index' }"
    class="text-decoration-none backBtn text-white btn btn-dark rounded-1 mb-4 d-block m-auto pt-2 pb-2"
  >
    Back to home</router-link
  >
  <div class="infoCards">
    <div class="row row-cols-1 row-cols-md-2 g-4">
      <div class="col">
        <!-- 1st card -->
        <div
          v-if="cocktail != null"
          class="card rounded-1 bg-dark text-white drinkCard"
          text="white"
          bg="dark"
          style="margin: auto"
        >
          <div class="card-header">
            <h1 class="h3">How to Make</h1>
            <h1 class="display-6" v-if="drinkName">{{ drinkName }}</h1>
            <!-- <h2>{{ applyTitleCase(cocktail.strDrink) }}</h2> -->
          </div>

          <a class="drinkImgContainer">
            <img
              class="card-img-bottom rounded-0 skeleton"
              bottom
              v-bind:src="cocktail.strDrinkThumb"
              v-bind:alt="imgAltText"
            />
          </a>

          <div class="card-footer text-muted">
            <li class="tagItem list-inline list-inline-item">
              {{ cocktail.strAlcoholic }}
            </li>
            <li class="tagItem list-inline list-inline-item">
              {{ cocktail.strCategory }}
            </li>
            <FavBtn
              class="mt-2 mb-2"
              v-if="currentUser"
              :drinkId="cocktail.idDrink"
            />
            <div v-else class="mt-2">
              <router-link class="loginLink" to="/login">Login</router-link> to
              add to favourites
            </div>
          </div>
        </div>
      </div>
      <div class="col">
        <!-- 2nd card -->
        <div
          v-if="cocktail != null"
          class="card rounded-1 h-100 bg-dark pb-3 pt-3 text-white drinkCard"
          text="white"
          bg="dark"
          style="margin: auto"
        >
          <div
            class="card-body"
            style="display: flex; align-items: center; justify-content: center"
          >
            <div>
              <h3>Directions</h3>
              <p>{{ cocktail.strInstructions }}</p>
              <br />
              <h3>Ingredients</h3>

              <table
                class="table text-white"
                style="width: 50%; margin: auto"
                sm
                dark
              >
                <tbody>
                  <tr v-for="item in getIngredients(cocktail)" :key="item">
                    <td>{{ item.ingredient }}</td>
                    <td>{{ item.measure }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <!-- </MDBRow> -->
    </div>
  </div>
</template>

<script>
import { useRoute } from "vue-router";
import getAllCocktails from "../../composables/fetchCocktails.js";
import { ref, watchEffect, computed } from "vue";
import FavBtn from "../../components/FavBtn.vue";
import getUser from "../../composables/getUser";
import { useMeta } from "vue-meta";
export default {
  components: {
    FavBtn,
  },
  setup() {
    const cocktail = ref(null);
    const drinkName = ref(null);
    const imgAltText = ref(null);
    const computedMeta = computed(() => ({
      // title: `${drinkName.value || ''} cocktail recipe`,
      title: drinkName.value
        ? "How to Make - " + drinkName.value + " - Cocktail Recipe"
        : "Cocktail Recipe",
      description: "",
    }));
    useMeta(computedMeta);
    const route = useRoute();
    const { allCocktails, fetchData, error } = getAllCocktails();
    const { currentUser } = getUser();

    const generateIngredientList = (cocktailObj) => {
      const ingredientObjs = getIngredients(cocktailObj);
      const ingredientList = ingredientObjs.map((obj) => {
        return obj.ingredient;
      });
      return ingredientList.toString().replace(/,/g, ", ");
    };
    const generateIngMeasureList = (cocktailObj) => {
      const ingredientObjs = getIngredients(cocktailObj);
      const ingredientList = ingredientObjs.map((obj) => {
        return obj.measure + obj.ingredient;
      });
      return ingredientList.toString().replace(/,/g, ", ");
    };

    const generateJsonld = computed(() => {
      let jsonld = null;
      if (cocktail.value) {
        jsonld = JSON.stringify({
          "@context": "https://schema.org/",
          "@type": "Recipe",
          "name": applyTitleCase(cocktail.value.strDrink),
          "image": cocktail.value.strDrinkThumb,
          "datePublished": cocktail.value.dateModified,
          "description":
            applyTitleCase(cocktail.value.strDrink) +
            "- Recipe and Ingredients",
          "keywords":
            "Cocktail Recipe, How to Make, Mixology, Alcoholic Drink," +
            cocktail.value.strTags +
            ", " +
            generateIngredientList(cocktail.value),
          "recipeYield": "1",
          "recipeCategory": "Cocktail",
          "recipeIngredient": [generateIngMeasureList(cocktail.value)],
          "recipeInstructions": {
            "@type": "HowToStep",
            "name": "Make",
            "text": cocktail.value.strInstructions,
            "url": window.location.origin + route.path,
            "image": cocktail.value.strDrinkThumb,
          },
        });
      }
      return jsonld;
    });

    //uses thecocktaildb api lookup query to retrieve up to date drink info
    const fetchCocktailByID = async (drinkId) => {
      const baseURL = "https://www.thecocktaildb.com/api/json/v2";
      const apiKey = import.meta.env.VITE_API_KEY
        ? import.meta.env.VITE_API_KEY
        : 1;
      const query = `lookup.php?i=${drinkId}`;
      const requestUrl = `${baseURL}/${apiKey}/${query}`;

      const response = await fetch(requestUrl);
      if (response.status !== 200) {
        throw new Error(response.status + " - Unable to fetch data.");
      }
      const responseJSON = await response.json();
      return responseJSON.drinks[0];
    };

    const populateCocktailData = async (drinkId) => {
      cocktail.value = null;
      try {
        cocktail.value = await fetchCocktailByID(drinkId);
        console.log("USING FETCHBYID");

        drinkName.value = applyTitleCase(cocktail.value.strDrink);
        imgAltText.value = drinkName.value + " Cocktail Photo";
      } catch (e) {
        //defaults to drink data stored in cache by service worker
        await fetchData();
        console.log("USING FETCHDATA");
        if (error.value) {
          return;
        }
        cocktail.value = getCocktailByID(allCocktails.value, drinkId);
        drinkName.value = applyTitleCase(cocktail.value.strDrink);
        imgAltText.value = drinkName.value + " Cocktail Photo";
      }
    };

    const getCocktailByID = (cocktailObjArray, drinkID) => {
      const drink = cocktailObjArray.find(
        (element) => element.idDrink === drinkID
      );
      return drink;
    };

    const applyTitleCase = (string) => {
      //separate strings by spaces
      let wordArray = string.split(" ");
      wordArray = wordArray.map((word) => {
        return word.substr(0, 1).toUpperCase() + word.substr(1, word.length);
      });
      return wordArray.join(" ");
    };

    const getIngredients = (cocktailObj) => {
      let ingredients = [];
      for (let i = 1; i <= 15; i++) {
        let ingNo = "strIngredient" + i;
        let measureNo = "strMeasure" + i;
        let obj = {
          ingredient: "",
          measure: "",
        };
        if (cocktailObj[ingNo]) {
          obj.ingredient = cocktailObj[ingNo];
          if (cocktailObj[measureNo]) {
            obj.measure = cocktailObj[measureNo];
          }
          ingredients.push(obj);
        }
      }
      return ingredients;
    };

    //repopulate drink info if the url id parameter changes
    watchEffect(() => {
      if (route.name == "drinks-id") {
        populateCocktailData(route.params.id);
      }
    });

    return {
      error,
      cocktail,
      getIngredients,
      currentUser,
      applyTitleCase,
      imgAltText,
      drinkName,
      generateJsonld,
    };
  },
};
</script>

<style scoped>
.fetchError {
  padding: 20px;
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

.drinkCard {
  box-shadow: 0 4px 8px 0 rgb(0 0 0 / 20%), 0 6px 20px 0 rgb(0 0 0 / 19%);
  border: none;
}

.backBtn {
  box-shadow: 0 4px 8px 0 rgb(0 0 0 / 20%), 0 6px 20px 0 rgb(0 0 0 / 19%);
}

.backBtn:active {
  background-color: #4d5154;
}

.tagItem {
  border: solid 1px;
  padding-left: 3px;
  padding-right: 3px;
  margin-bottom: 5px;
}

.infoCards {
  margin: 0 auto;
  max-width: 1050px;
  text-align: center;
}

.vertical-center {
  margin: auto;
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
}
</style>
