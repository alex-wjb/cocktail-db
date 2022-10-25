<template>
<h1 v-if="drinkName">How to Make: {{drinkName}}</h1>
  <div v-if="error" class="fetchError">
    <div style="height: fit-content">
      <h4 class="errorTxt">Unable to retrieve cocktail data.</h4>
      <h4 class="errorTxt">Please try again later.</h4>
    </div>
  </div>
  <div class="infoCards">
    <MDBRow :cols="['1', 'md-2']" class="g-4">
      <MDBCol>
        <MDBCard
          v-if="cocktail != null"
          class="rounded-0 h-100"
          text="white"
          bg="dark"
          style="max-width: 940px; margin: auto"
        >
          <MDBCardHeader>
            <h2>{{ applyTitleCase(cocktail.strDrink) }}</h2>
          </MDBCardHeader>

          <a class="drinkImgContainer">
            <MDBCardImg
              class="rounded-0 skeleton"
              bottom
              v-bind:src="cocktail.strDrinkThumb"
              v-bind:alt="imgAltText"
            />
          </a>

          <MDBCardFooter class="text-muted">
            <li class="tagItem list-inline list-inline-item">
              {{ cocktail.strAlcoholic }}
            </li>
            <li class="tagItem list-inline list-inline-item">
              {{ cocktail.strCategory }}
            </li>
            <FavBtn v-if="currentUser" :drinkId="cocktail.idDrink" />
          </MDBCardFooter>
        </MDBCard>
      </MDBCol>
      <MDBCol>
        <MDBCard
          v-if="cocktail != null"
          class="rounded-0 h-100"
          text="white"
          bg="dark"
          style="max-width: 940px; margin: auto"
        >
          <MDBCardBody>
            <h3>Directions</h3>
            <p>{{ cocktail.strInstructions }}</p>
            <br />
            <h3>Ingredients</h3>

            <MDBTable style="width: 50%; margin: auto" sm dark>
              <tbody>
                <tr v-for="item in getIngredients(cocktail)" :key="item">
                  <td>{{ item.ingredient }}</td>
                  <td>{{ item.measure }}</td>
                </tr>
              </tbody>
            </MDBTable>
          </MDBCardBody>
          <MDBCardFooter class="text-muted"> </MDBCardFooter>
        </MDBCard>
      </MDBCol>
    </MDBRow>
  </div>
</template>

<script>
import { useRoute } from "vue-router";
import getAllCocktails from "../composables/fetchCocktails.js";
import { ref, watchEffect, computed} from "vue";
import FavBtn from "../components/FavBtn";
import getUser from "../composables/getUser";
import { useMeta } from 'vue-meta';

import {
  MDBCard,
  MDBCardHeader,
  MDBCardImg,
  MDBCardFooter,
  MDBTable,
  MDBCol,
  MDBRow,
  MDBCardBody,
} from "mdb-vue-ui-kit";
export default {
  components: {
    MDBCard,
    MDBCardHeader,
    MDBCardImg,
    MDBCardFooter,
    MDBTable,
    MDBCol,
    MDBRow,
    MDBCardBody,
    FavBtn,
  },
  setup() {
    const cocktail = ref(null);
    const drinkName = ref(null);
    const imgAltText = ref(null);
   const computedMeta = computed(() => ({
      // title: `${drinkName.value || ''} cocktail recipe`,
      title: drinkName.value ? 'How to Make - ' + drinkName.value + ' - Cocktail Recipe' : "Cocktail Recipe",
      description : ''
    }))
    useMeta(computedMeta);
    const route = useRoute();
    const { allCocktails, fetchData, error } = getAllCocktails();
    const { currentUser } = getUser();

    //uses thecocktaildb api lookup query to retrieve up to date drink info
    const fetchCocktailByID = async (drinkId)=>{
      const baseURL = "https://www.thecocktaildb.com/api/json/v2";
      const apiKey = "9973533";
      const query = `lookup.php?i=${drinkId}`;
      const requestUrl = `${baseURL}/${apiKey}/${query}`;
   
      const response = await fetch(requestUrl);
        if (response.status !== 200) {
          throw new Error(response.status + " - Unable to fetch data.");
        }
        const responseJSON = await response.json();
        return responseJSON.drinks[0];
      }
   
    const populateCocktailData = async (drinkId) => {
      cocktail.value = null;
      try {
        cocktail.value = await fetchCocktailByID(drinkId);
        console.log(drinkName.value);
        drinkName.value = applyTitleCase(cocktail.value.strDrink);
        imgAltText.value = drinkName.value + " Cocktail Photo"
        console.log(drinkName.value);
      } catch (e) {
        //defaults to drink data stored in cache by service worker 
        await fetchData();
        if (error.value) {
          return;
        }
        cocktail.value = getCocktailByID(allCocktails.value, drinkId);
        drinkName.value = applyTitleCase(cocktail.value.strDrink);
        imgAltText.value = drinkName.value + " Cocktail Photo"
     
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
      let  wordArray = string.split(" ");
      wordArray = wordArray.map(word=>{
        return word.substr(0,1).toUpperCase() + word.substr(1,word.length);
      })
      return wordArray.join(' ');
    }

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
      if(route.name=="DrinkInfo"){
        populateCocktailData(route.params.id);
      }
    });

    return { error, cocktail, getIngredients, currentUser, applyTitleCase, imgAltText, drinkName};
  },
};
</script>

<style>
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

.tagItem {
  border: solid 1px;
  padding-left: 3px;
  padding-right: 3px;
  margin-bottom: 5px;
}

.infoCards {
  margin: 0 auto;
  margin-top: 25px;
  max-width: 1200px;
}
</style>
