<template>
  <div class="drinkInfo">
    <body>
      <MDBContainer>
        {{ error }}
      </MDBContainer>
      <!-- <MDBContainer class="border" v-if="cocktail !=null">
      <h2>{{ cocktail.strDrink }}</h2>
      <img class="img-fluid" :src="cocktail.strDrinkThumb" :alt="cocktail.strDrink">
     <p> {{ cocktail.strInstructions }}</p>
    </MDBContainer> -->

      <MDBCard
        v-if="cocktail != null"
        class="rounded-0 h-100"
        text="white"
        bg="dark"
        style="max-width: 940px; margin: auto;"
      >
        <MDBCardHeader>
          <MDBCardTitle><h1>{{ cocktail.strDrink }}</h1></MDBCardTitle>
        </MDBCardHeader>

        <a class="drinkImgContainer">
          <MDBCardImg
            class="rounded-0 drinkImg skeleton"
            bottom
            v-bind:src="cocktail.strDrinkThumb"
            v-bind:alt="cocktail.strDrink"
          />
        </a>

        <MDBCardFooter class="text-muted"> </MDBCardFooter>
      </MDBCard>

      <MDBCard
        v-if="cocktail != null"
        class="rounded-0 h-100"
        text="white"
        bg="dark"
        style="max-width: 940px; margin: auto;"
      >
        <MDBCardHeader>
          <MDBCardTitle>Drink Details</MDBCardTitle>
        </MDBCardHeader>
        <MDBCardBody>
          <h3>Instructions:</h3>
          <p>{{cocktail.strInstructions}}</p>
          <h3>Ingredients:</h3>
          
          <MDBTable style="width: 50%; margin: auto;" sm dark>
     <tbody>
      <tr v-for="item in getIngredients(cocktail)"
            :key="item">
        <td>{{item.ingredient}}</td>
        <td>{{item.measure}}</td>
      </tr>
      </tbody>
          </MDBTable>

        </MDBCardBody>
        <MDBCardFooter class="text-muted"> 
           <li class="ingredientItem list-inline list-inline-item"
            >
              {{cocktail.strAlcoholic}}
            </li>
            <li class="ingredientItem list-inline list-inline-item"
            >
              {{cocktail.strCategory}}
            </li>
        </MDBCardFooter>
      </MDBCard>
    </body>
  </div>
</template>

<script>
import { useRoute } from "vue-router";
import getAllCocktails from "../composables/fetchCocktails.js";
import { ref } from "vue";
import {
  MDBContainer,
  MDBCard,
  MDBCardHeader,
  MDBCardImg,
  MDBCardFooter,
  MDBTable
} from "mdb-vue-ui-kit";
export default {
  components: {
    MDBContainer,
    MDBCard,
    MDBCardHeader,
    MDBCardImg,
    MDBCardFooter,
    MDBTable
  },
  setup() {
    const cocktail = ref(null);
    const route = useRoute();
    const { allCocktails, fetchData, error } = getAllCocktails();

    const populateCocktailData = async () => {
      await fetchData();
      if (error.value) {
        return;
      }
      cocktail.value = getCocktailByID(allCocktails.value, route.params.id);
    };

    const getCocktailByID = (cocktailObjArray, drinkID) => {
      console.log(cocktailObjArray);
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
          measure: ""
        }
        if (cocktailObj[ingNo]) {
          obj.ingredient = cocktailObj[ingNo];
          if (cocktailObj[measureNo]){
            obj.measure = cocktailObj[measureNo]
          }
          ingredients.push(obj);
        }
      }
      return ingredients;
    };

    populateCocktailData();
    return { error, cocktail, getIngredients };
  },
};
</script>

<style scoped>
.drinkInfo {
  background-color: lightgrey;
  min-height: 100vh;
  padding-top: 115px;
  width: 100%;
  overflow-x: hidden;
  padding-left: 25px;
  padding-right: 25px;
  padding-bottom: 25px;
}

body{
  background-color: lightgrey;
}

.ingredientItem {
  padding-left: 3px;
  padding-right: 3px;
  margin-bottom: 5px;
}
</style>
