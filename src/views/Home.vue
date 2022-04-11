<template>
  <div class="btn-div">
    <MDBBtn color="dark" class="mb-4 floating-btn rounded-0" @click="setRandom"
      >Randomize</MDBBtn
    >
  </div>
  <div class="home">
    <img alt="cocktail database logo" src="../assets/watercolor-title.png" />

    <!-- rows have one column, cards split equal width to fit 3, up to a breakpoint-->
    <!-- g-4 = grid gap of 4 -->
    <MDBRow :cols="['1', 'md-3']" class="g-4"> <!-- cols col to each row-->
      
        <MDBCol v-for="item in randomCocktails"
        :key="item.idDrink">
          <MDBCard class="rounded-0" text="white" bg="dark">
            <MDBCardBody>
              <MDBCardTitle>{{ item.strDrink }}</MDBCardTitle>

              <MDBCardText>
                <!-- {{ item.strInstructions }} -->
              </MDBCardText>
            </MDBCardBody>
             <a class="drinkImgContainer"> 
            <MDBCardImg class="rounded-0 drinkImg skeleton" bottom v-bind:src="item.strDrinkThumb" v-bind:alt="item.strDrink" />
            </a>
          </MDBCard>
        </MDBCol>

    </MDBRow>



  </div>
</template>
<script>
// @ is an alias to /src
import { ref } from "vue";
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardText,
  MDBCardTitle,
  // MDBContainer,
  MDBCardImg,
  MDBCol,
  MDBRow,
} from "mdb-vue-ui-kit";
export default {
  name: "Home",
  components: {
    MDBCard,
    MDBCardBody,
    MDBCardTitle,
    MDBCardText,
    MDBBtn,
    // MDBContainer,
    MDBCardImg,
    MDBCol,
    MDBRow,
  },
  setup() {
    //Connect to cocktaildb API
    const allCocktails = ref(null);
    const randomCocktails = ref(null);
    const baseURL = "https://www.thecocktaildb.com/api/json/v2";
    const apiKey = "9973533";
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    const cocktailName = ref(null);
    const cocktailInst = ref(null);
    const cocktailImgSrc = ref(null);

    //sends Fetch API request returning results as json
    const sendRequest = async (requestUrl) => {
      console.log(requestUrl);
      //returns promise containing response object on resolve
      try {
        const response = await fetch(requestUrl);
        if (response.status !== 200) {
          throw new Error(response.status + " - Unable to fetch data.");
        }
        const responseJSON = await response.json();
        console.log(responseJSON);
        return responseJSON;
      } catch (err) {
        console.log(err.message);
        return Promise.reject(err.message);
      }
    };

    //returns promise resolving to array of cocktails a-z
    const getAllCocktails = async () => {
      const charsAZ = Array.from(alphabet);
      const cocktailsAZ = await Promise.all(
        charsAZ.map(async (char) => {
          const query = `search.php?f=${char}`;
          const requestUrl = `${baseURL}/${apiKey}/${query}`;
          return sendRequest(requestUrl);
        })
      );
      let allCocktails = [];
      cocktailsAZ.forEach((element) => {
        if (element.drinks !== null) {
          allCocktails = allCocktails.concat(element.drinks);
        }
      });
      console.log(allCocktails);
      console.log(allCocktails.length);
      return new Promise((resolve, reject) => {
        resolve(allCocktails);
        reject();
      });
    };

    const getCocktailObject = () => {
      console.log(allCocktails.value[1]);
      return allCocktails.value[1];
    };

    const populateCocktailData = (cocktailObj) => {
      cocktailName.value = cocktailObj.strDrink;
      console.log(cocktailName.value);
      cocktailInst.value = cocktailObj.strInstructions;
      cocktailImgSrc.value = cocktailObj.strDrinkThumb;
    };

    const getRandomCocktails = (n) => {
      const cocktails = allCocktails.value;
      let randomCocktails = [];
      for (let i = 0; i < n; i++) {
        randomCocktails = randomCocktails.concat(
          cocktails.splice(Math.random() * cocktails.length, 1)
        );
      }
      console.log(randomCocktails);
      return randomCocktails;
    };

    getAllCocktails()
      .then((data) => {
        allCocktails.value = data;
      })
      .then(() => {
        console.log(allCocktails.value);
      })
      .then(() => {
        populateCocktailData(getCocktailObject());
      })
      .then(() => {
        setRandom();
      });

    const setRandom = () => {
      randomCocktails.value = getRandomCocktails(12);
      window.scrollTo(0, 0);
    };

    return {
      allCocktails,
      cocktailName,
      cocktailInst,
      cocktailImgSrc,
      randomCocktails,
      setRandom,
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

.home {
  background-color: lightgrey;
  min-height: 100vh;
  padding-top: 115px;
  width: 100%;
  overflow-x: hidden;
  padding-left: 25px;
  padding-right: 25px;
  padding-bottom: 25px;
}

.floating-btn {
  margin: 0 auto;
  text-align: center;
  display: block;
  z-index: 999;
  margin-top: 30px;
}
.btn-div {
  width: 100vw;
  position: fixed;
  z-index: 999;
  height: 5px;
  padding-top: 40px;
}

.drinkImg {
  opacity: 1;
  transition: .5s ease;
  backface-visibility: hidden;
}

.drinkImgContainer:hover .drinkImg {
  opacity: 0.6;
}

</style>
