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
    <MDBRow :cols="['1', 'md-3']" class="g-4">
      <!-- cols col to each row-->

      <MDBCol v-for="item in randomCocktails" :key="item.idDrink">
        <MDBCard class="rounded-0" text="white" bg="dark">
          <MDBCardBody>
            <MDBCardTitle>{{ item.strDrink }}</MDBCardTitle>

            <MDBCardText>
              <!-- {{ item.strInstructions }} -->
            </MDBCardText>
          </MDBCardBody>
          <MDBBtn
            color="primary"
            aria-controls="exampleModal"
            @click="(exampleModal = true), populateDrinkModal(item.idDrink)"
          >
            Launch modal
          </MDBBtn>
          <a class="drinkImgContainer">
            <MDBCardImg
              class="rounded-0 drinkImg skeleton"
              bottom
              v-bind:src="item.strDrinkThumb"
              v-bind:alt="item.strDrink"
            />
          </a>
        </MDBCard>
      </MDBCol>
    </MDBRow>

    <MDBModal
      id="exampleModal"
      tabindex="-1"
      labelledby="exampleModalLabel"
      v-model="exampleModal"
      centered="true"
      size="xl"
      class="text-center"
      
    >
    <!-- <div class="text-center"> -->
      <MDBModalHeader style="text-align:center !important; justify-content: center!important; width:100% !important; border:1px solid white;" color="dark" class="text-light text-center justify-content-center" :close="false">
        <!-- <div class="justify-content-center"> -->
        <MDBModalTitle style="text-align:center !important; justify-content: center!important; width:100% !important;" bold="true" class="text-center" id="exampleModalLabel">
         <p class="myModalTitle"> {{ cocktailName }} </p>
        
        </MDBModalTitle>
        <!-- </div> -->
      </MDBModalHeader>
      <!-- </div> -->
      <MDBModalBody class="bg-dark text-light"
        >{{ cocktailInst }}
        <img class="img-fluid" v-bind:src="cocktailImgSrc" alt="" />
      </MDBModalBody>
      <MDBModalFooter class="bg-dark">
        <MDBBtn color="secondary" @click="exampleModal = false">Close</MDBBtn>
        <MDBBtn color="primary">Save changes</MDBBtn>
      </MDBModalFooter>
    </MDBModal>
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
  MDBModal,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
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
    MDBModal,
    MDBModalHeader,
    MDBModalTitle,
    MDBModalBody,
    MDBModalFooter,
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
    const exampleModal = ref(false);

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

    const getCocktailByID = (cocktailObjArray, drinkID) => {
      const drink = cocktailObjArray.find(
        (element) => element.idDrink === drinkID
      );
      return drink;
    };

    const populateDrinkModal = (drinkID) => {
      const drinkObj = getCocktailByID(randomCocktails.value, drinkID);
      cocktailName.value = drinkObj.strDrink;
      cocktailInst.value = drinkObj.strInstructions;
      cocktailImgSrc.value = drinkObj.strDrinkThumb;
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

    // const getCocktailObject = () => {
    //   console.log(allCocktails.value[1]);
    //   return allCocktails.value[1];
    // };

    // const populateCocktailData = (cocktailObj) => {
    //   cocktailName.value = cocktailObj.strDrink;
    //   console.log(cocktailName.value);
    //   cocktailInst.value = cocktailObj.strInstructions;
    //   cocktailImgSrc.value = cocktailObj.strDrinkThumb;
    // };

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
      exampleModal,
      populateDrinkModal,
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
  transition: 0.5s ease;
  backface-visibility: hidden;
}

.drinkImgContainer:hover .drinkImg {
  opacity: 0.6;
}

.justify-content-center {
  text-align: center!important;
  justify-content: center!important;
}

.modal-title{
   text-align: center!important;
   justify-content: center!important;
}

.myModalTitle{
  text-align: center!important;
  width:100%;
}

</style>
