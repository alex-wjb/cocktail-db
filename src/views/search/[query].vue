<template>
    <h2 v-if="searchQuery">Results for: "{{ searchQuery }}"</h2>

    <div v-if="results">{{ results.length }} Results</div>

    <nav aria-label="Drinks Results Page Navigation">
      <MDBPagination v-if="getPageResults">
        <MDBPageItem @click="pageBack">Previous</MDBPageItem>
        <div v-for="item in numbersShown" :key="item">
          <div v-if="item == pgNum">
            <MDBPageItem active @click="setPageNumber(item)">{{
              item
            }}</MDBPageItem>
          </div>
          <div v-else>
            <MDBPageItem @click="setPageNumber(item)">{{ item }}</MDBPageItem>
          </div>
        </div>
        <MDBPageItem @click="pageForward">Next</MDBPageItem>
      </MDBPagination>
    </nav>

    <MDBListGroup flush v-if="getPageResults">
      <MDBListGroupItem
        class="resultItem"
        style="background-color: lightgrey"
        v-for="item in getPageResults"
        :key="item"
      >
        <router-link :to="{ name: 'drinks-id', params: { id: item.idDrink } }">
          <img
            class="resultImg"
            :src="item.strDrinkThumb"
            v-bind:alt="item.strDrink"
          />
        </router-link>

        <router-link
          :to="{ name: 'drinks-id', params: { id: item.idDrink } }"
          class="drinkTitle"
          >{{ item.strDrink }}</router-link
        ></MDBListGroupItem
      >
    </MDBListGroup>

    <nav class="bottomPageNav" aria-label="Drinks Results Page Navigation">
      <MDBPagination v-if="getPageResults">
        <MDBPageItem @click="pageBack">Previous</MDBPageItem>
        <div v-for="item in numbersShown" :key="item">
          <div v-if="item == pgNum">
            <MDBPageItem active @click="setPageNumber(item)">{{
              item
            }}</MDBPageItem>
          </div>
          <div v-else>
            <MDBPageItem @click="setPageNumber(item)">{{ item }}</MDBPageItem>
          </div>
        </div>
        <MDBPageItem @click="pageForward">Next</MDBPageItem>
      </MDBPagination>
    </nav>
</template>

<script>
import { useRoute } from "vue-router";
import { ref, watchEffect, computed } from "vue";
import getAllCocktails from "../../composables/fetchCocktails.js";

import {
  MDBListGroup,
  MDBListGroupItem,
  MDBPagination,
  MDBPageItem,
} from "mdb-vue-ui-kit";
export default {
  components: {
    MDBListGroup,
    MDBListGroupItem,
    MDBPagination,
    MDBPageItem,
    
  },
  setup() {
    const route = useRoute();
    const searchQuery = ref("");
    const results = ref([null]);
    const { allCocktails, fetchData, error } = getAllCocktails();
    const pgNum = ref(1);
    const resultChunks = ref([]);

    const setPageNumber = (n) => {
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
      const resultsPerPage = 10;
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
      }
    };

    const pageForward = () => {
      if (pgNum.value < resultChunks.value.length) {
        pgNum.value++;
      }
    };

    const populateResults = async (searchString) => {
      pgNum.value = 1;
      results.value = null;
      const baseURL = "https://www.thecocktaildb.com/api/json/v2";
      const apiKey = "9973533";
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
    };
  },
};
</script>

<style>
/* only works when style not scoped */
.page-item.active .page-link {
  background-color: #262626 !important;
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
.resultItem {
  text-align: left;
  word-wrap: normal;
}

/* vertically centers text */
a.drinkTitle {
  color: black !important;
  margin: 0;
  position: absolute;
  top: 50%;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
}
a.drinkTitle:hover {
  color: grey !important;
}

.bottomPageNav {
  padding-top: 15px;
}
</style>
