<template>
  <h2 class="mb-4" v-if="searchQuery">Results for: "{{ searchQuery }}"</h2>

  <div v-if="results">{{ results.length }} Results</div>
  <nav
    class="mt-4"
    aria-label="page navigation for cocktail database search results"
  >
    <ul class="pagination" v-if="getPageResults">
      <li
        style="width: 90px; height: 40px"
        class="page-link text-center prevNextBtn"
        @click="pageBack"
      >
        Previous
      </li>
      <div v-for="item in numbersShown" :key="item">
        <div v-if="item == pgNum">
          <li
            class="page-link active text-center"
            style="width: 40px; height: 40px"
            @click="setPageNumber(item)"
          >
            {{ item }}
          </li>
        </div>
        <div v-else>
          <li
            class="page-link text-center"
            style="width: 40px; height: 40px"
            @click="setPageNumber(item)"
          >
            {{ item }}
          </li>
        </div>
      </div>
      <li
        style="width: 90px"
        class="page-link text-center prevNextBtn"
        @click="pageForward"
      >
        Next
      </li>
    </ul>
  </nav>
  <div v-if="getPageResults" >
    <div
      class="pt-4 pb-4"
      style="background-color: lightgrey; white-space: nowrap; border-bottom: 1px solid grey;"
      v-for="item in getPageResults"
      :key="item"
    >

    <div class="d-inline-block">
      <router-link :to="{ name: 'drinks-id', params: { id: item.idDrink } }">
        <img
          class="resultImg"
          crossorigin="anonymous"
          :src="item.strDrinkThumb+'/preview'"
          v-bind:alt="item.strDrink"
          
        />
      </router-link>
    </div>
    <div style=" width:70%;  white-space:normal" class="d-inline-block align-middle">
      <router-link
        style=""
        :to="{ name: 'drinks-id', params: { id: item.idDrink } }"
        class="drinkTitle d-block ps-4 pb-0 text-decoration-none"
        ><h3>{{ item.strDrink }}</h3></router-link
      >
      <div class="d-block ps-4">
        <p
          class=" me-2 mb-2 p-1 ingredientItem d-inline-block rounded-1"
          style="background-color:#86d5b8"
          v-for="item in getIngredients(item)"
          :key="item"
        >
          {{ item }}
        </p>
      </div>
    </div>
    </div>
  </div>

  <nav
    class="mt-4"
    aria-label="page navigation for cocktail database search results"
  >
    <ul class="pagination" v-if="getPageResults">
      <li
        style="width: 90px; height: 40px"
        class="page-link text-center prevNextBtn"
        @click="pageBack"
      >
        Previous
      </li>
      <div v-for="item in numbersShown" :key="item">
        <div v-if="item == pgNum">
          <li
            class="page-link active text-center"
            style="width: 40px; height: 40px"
            @click="setPageNumber(item)"
          >
            {{ item }}
          </li>
        </div>
        <div v-else>
          <li
            class="page-link text-center"
            style="width: 40px; height: 40px"
            @click="setPageNumber(item)"
          >
            {{ item }}
          </li>
        </div>
      </div>
      <li
        style="width: 90px"
        class="page-link text-center prevNextBtn"
        @click="pageForward"
      >
        Next
      </li>
    </ul>
  </nav>
</template>

<script>
import { useRoute } from "vue-router";
import { ref, watchEffect, computed } from "vue";
import getAllCocktails from "../../composables/fetchCocktails.js";

export default {
  components: {},
  setup() {
    const route = useRoute();
    const searchQuery = ref("");
    const results = ref([null]);
    const { allCocktails, fetchData, error } = getAllCocktails();
    const pgNum = ref(1);
    const resultChunks = ref([]);

    const setPageNumber = (n) => {
      window.scroll({
        top: 0,
        left: 0,
        behavior: "instant",
      });
      pgNum.value = n;
    };

    const numbersShown = computed(() => {
      let numShown = 5; //sets limit of page numbers shown
      //sets number of pages if less than 5
      numShown = Math.min(numShown, resultChunks.value.length);
      let first = pgNum.value - Math.floor(numShown / 2);
      first = Math.max(first, 1);
      first = Math.min(first, resultChunks.value.length - numShown + 1);
      let pagesShown = [first];
      for (let i = 1; i < numShown; i++) {
        pagesShown.push(first + i);
      }

      return pagesShown;
    });

    //returns array of result arrays of length n, where n = results per page
    const splitResults = (results) => {
      const resultChunks = [];
      const resultsPerPage = 30;
      for (let i = 0; i < results.length; i = i + resultsPerPage) {
        const resultsChunk = results.slice(i, i + resultsPerPage);
        resultChunks.push(resultsChunk);
      }
      return resultChunks;
    };

    const getPageResults = computed(() => {
      return resultChunks.value[pgNum.value - 1];
    });

    const pageBack = () => {
      if (pgNum.value > 1) {
        pgNum.value--;
        window.scroll({
          top: 0,
          left: 0,
          behavior: "instant",
        });
      }
    };

    const pageForward = () => {
      if (pgNum.value < resultChunks.value.length) {
        pgNum.value++;
        window.scroll({
          top: 0,
          left: 0,
          behavior: "instant",
        });
      }
    };

    const populateResults = async (searchString) => {
      pgNum.value = 1;
      results.value = null;
      const baseURL = "https://www.thecocktaildb.com/api/json/v2";
      const apiKey = (import.meta.env.VITE_API_KEY ? import.meta.env.VITE_API_KEY : 1);
      const query = `search.php?s=${searchString}`;
      const requestUrl = `${baseURL}/${apiKey}/${query}`;
      try {
        const response = await fetch(requestUrl);
        if (response.status !== 200) {
          throw new Error(response.status + " - Unable to fetch data.");
        }
        const responseJSON = await response.json();
        sortResults(responseJSON.drinks, searchString);
        results.value = responseJSON.drinks;
        resultChunks.value = splitResults(results.value);
      } catch (e) {
        await fetchData();
        if (error.value) {
          return;
        }
        results.value = searchDrinks(allCocktails.value, searchString);
        resultChunks.value = splitResults(results.value);
      }
    };
    watchEffect(() => {
      searchQuery.value = route.params.query;
      populateResults(searchQuery.value);
    });

    const searchDrinks = (drinks, searchString) => {
      let searchResults = drinks.filter(
        (drink) =>
          //if there is an occurence of the search string in the
          //drink name, then return true and
          //add to the new filtered array
          drink.strDrink.toLowerCase().indexOf(searchString.toLowerCase()) !==
          -1
      );

      sortResults(searchResults, searchString);
      //LIMIT SEARCH RESULTS
      //searchResults = searchResults.slice(0,numResults);
      return searchResults;
    };

    //sorts results by alphabet and relevancy
    const sortResults = (searchResults, searchString) => {
      searchResults.sort((a, b) => {
        a = a.strDrink.toLowerCase();
        b = b.strDrink.toLowerCase();
        searchString = searchString.toLowerCase();
        if (a.startsWith(searchString) && !b.startsWith(searchString)) {
          return -1;
        }
        if (!a.startsWith(searchString) && b.startsWith(searchString)) {
          return 1;
        }
        if (a.startsWith(searchString) && b.startsWith(searchString)) {
          return a.localeCompare(b);
        }
      });
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
      searchQuery,
      results,
      setPageNumber,
      resultChunks,
      pgNum,
      getPageResults,
      pageBack,
      pageForward,
      numbersShown,
      getIngredients,
    };
  },
};
</script>

<style scoped>
/* only works when style not scoped */
.page-link {
  background-color: #262626;
  color: white;
  border-color: lightgrey;
}
.page-link:hover {
  cursor: pointer;
  background-color:  #262626;
}

.page-link:active{
  background-color:#414551!important;
}
.prevNextBtn:hover {
  background-color: #262626;
  cursor: pointer;
}

button:hover{
  background-color: #262626;
}

@media (hover: hover) {
    .prevNextBtn:hover {
        background-color: #414551;
    }
    .page-link:hover {
        background-color:  #414551;
    }
}

.page-link.active {
  /* background-color: #414551 !important; */
  background-color: grey !important;
  color: black;
  border: 2px solid #262626;
}

.resultImg {
  width: 100px;
  height: 100px;
  display: inline-block;
}
.drinkTitle {
  display: inline-block;
  padding: 20px;
}
/* .resultItem {
  text-align: left;
  word-wrap: normal;
} */

/* vertically centers text */
/* a.drinkTitle {
  color: black !important;
  margin: 0;
  position: absolute;
  top: 50%;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
} */
a.drinkTitle:hover {
  color: grey !important;
}

.bottomPageNav {
  padding-top: 15px;
}
</style>
