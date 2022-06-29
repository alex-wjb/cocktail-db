<template>
  <!-- <div class="drinkInfo"> -->
    <PageWrapper>
   
      <MDBContainer>
        {{ error }}
      </MDBContainer>
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
                <h2>{{ cocktail.strDrink }}</h2>
              </MDBCardHeader>
              

              <a class="drinkImgContainer">
                <MDBCardImg
                  class="rounded-0 skeleton"
                  bottom
                  v-bind:src="cocktail.strDrinkThumb"
                  v-bind:alt="cocktail.strDrink"
                />
              </a>

              <MDBCardFooter class="text-muted">
                <li class="tagItem list-inline list-inline-item">
                  {{ cocktail.strAlcoholic }}
                </li>
                <li class="tagItem list-inline list-inline-item">
                  {{ cocktail.strCategory }}
                </li>
                 <FavBtn v-if="currentUser" :drinkId="cocktail.idDrink"/>
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
   
    </PageWrapper>
  <!-- </div> -->
</template>

<script>
import { useRoute } from "vue-router";
import getAllCocktails from "../composables/fetchCocktails.js";
import { ref, watchEffect } from "vue";
import FavBtn from "../components/FavBtn"
import getUser from "../composables/getUser";
import PageWrapper from "../components/PageWrapper";
 
import {
  MDBContainer,
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
    MDBContainer,
    MDBCard,
    MDBCardHeader,
    MDBCardImg,
    MDBCardFooter,
    MDBTable,
    MDBCol,
    MDBRow,
    MDBCardBody,
    FavBtn,
    PageWrapper
  },
  setup() {
    const cocktail = ref(null);
    const route = useRoute();
    const { allCocktails, fetchData, error } = getAllCocktails();
    const { currentUser } = getUser();

    const populateCocktailData = async (drinkId) => {
      cocktail.value = null;
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
      } catch (e) {
        await fetchData();
        if (error.value) {
          return;
        }
        cocktail.value = getCocktailByID(allCocktails.value, drinkId);
        console.log(cocktail.value);
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

    watchEffect(() => {
      populateCocktailData(route.params.id);
    });

    return { error, cocktail, getIngredients, currentUser};
  },
};
</script>

<style>
/* .drinkInfo {
  background-color: lightgrey;
  min-height: 100vh;
  padding-top: 80px;
  width: 100%;
  overflow-x: hidden;
  padding-left: 25px;
  padding-right: 25px;
  padding-bottom: 25px;
} */



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
