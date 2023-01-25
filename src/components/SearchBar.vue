<template>
  <div
    class="searchContainer d-flex flex-wrap"
    style="
      display: block !important;
      position: relative;
      padding-left: 20px;
      padding-right: 20px;
    "
  >
    <form
      role="search"
      id="searchInput"
      class="d-flex"
      style="width: 100% !important"
    >
      <input
        class="form-control rounded-0 searchBar"
        type="search"
        label="Search Drinks"
        placeholder="Search cocktails"
        aria-label="Search"
        v-model="searchQuery"
        @keydown.enter.prevent="search"
      />

      <button
        class="btn btn-outline-secondary rounded-0 searchBtn"
        type="button"
        @click="search"
        id="searchBtn"
        color="dark"
        outline="light"
        :disabled="!searchValid"
      >
        Search
      </button>
    </form>

    <div
      v-show="searchQuery"
      id="searchResult"
      class="list-group rounded-0"
      style="width: calc(100% - 40px); position: absolute"
    >
      <router-link
        class="searchLink"
        style="width: 100%; padding: 0 !important"
        @click="closeSearch"
        v-for="item in limitedDrinkResults"
        :key="item"
        :to="{ name: 'drinks-id', params: { id: item.idDrink } }"
        ><div
          style="width: 100%"
          data-bs-toggle="collapse"
          data-bs-target=".navbar-collapse.show"
          class="list-group-item list-group-item-action searchResults"
        >
          {{ item.strDrink }}
        </div></router-link
      >
      <li
        data-bs-toggle="collapse"
        data-bs-target=".navbar-collapse.show"
        class="list-group-item list-group-item-action list-group-item-dark moreResults"
        @click="search"
        v-if="searchedDrinks.length > numResults"
        tag="button"
      >
        {{ searchedDrinks.length }} More results...
      </li>

      <li
        class="list-group-item list-group-item-action list-group-item-dark noResults"
        tag="button"
        v-if="searchedDrinks.length == 0"
      >
        0 Results
      </li>
    </div>
  </div>
</template>

<script>
import getAllCocktails from "../composables/fetchCocktails.js";
import { ref, computed, watchEffect, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
export default {
  emits: ["searchEvent"],
  setup(props, ctx) {
    const drinks = ref(null);
    const { allCocktails, fetchData, error } = getAllCocktails();
    const searchQuery = ref("");
    const numResults = 5;
    const router = useRouter();
    const searchValid = ref(false);
    const resultsHover = ref(false);
    const searchBtnHover = ref(false);

    // CHECK IT WORKS ON MOBILE
    onMounted(() => {
      const inputEl = document.getElementById("searchInput");
      const resultsEl = document.getElementById("searchResult");
      const searchBtnEl = document.getElementById("searchBtn");
      inputEl.addEventListener("focusout", () => {
        if (!resultsHover.value && !searchBtnHover.value) {
          closeSearch();
        }
      });
      resultsEl.addEventListener("mouseover", () => {
        resultsHover.value = true;
      });
      resultsEl.addEventListener("mouseleave", () => {
        resultsHover.value = false;
      });
      searchBtnEl.addEventListener("mouseover", () => {
        searchBtnHover.value = true;
      });
      searchBtnEl.addEventListener("mouseleave", () => {
        searchBtnHover.value = false;
      });
    });
    onBeforeUnmount(() => {
      const inputEl = document.getElementById("searchInput");
      inputEl.removeEventListener("focusout");
      inputEl.removeEventListener("mouseover");
      inputEl.removeEventListener("mouseleave");

      const resultsEl = document.getElementById("searchInput");
      resultsEl.removeEventListener("mouseover");
      resultsEl.removeEventListener("mouseleave");

      const searchBtnEl = document.getElementById("searchInput");
      searchBtnEl.removeEventListener("mouseover");
      searchBtnEl.removeEventListener("mouseleave");
    });

    const populateDrinks = async () => {
      await fetchData();
      if (error.value) {
        return;
      }
      drinks.value = allCocktails.value;
    };

    const search = () => {
      let query = searchQuery.value;
      searchQuery.value = "";
      // unfocusSearch();
      closeSearch();
      //navigate to results page
      router.push({ name: "search-query", params: { query: query } });
    };

    const closeSearch = () => {
      //set value of input element
      //  searchBar.value.$el.nextElementSibling.firstElementChild.value = "";

      //clear v-model ref
      searchQuery.value = "";
      ctx.emit("searchEvent");
    };

    const searchedDrinks = computed(() => {
      const queryString = searchQuery.value.toLowerCase();
      let searchResults = [];
      if (drinks.value) {
        searchResults = drinks.value.filter(
          (drink) =>
            //if there is an occurence of the search string in the
            //drink name, then return true and
            //add to the new filtered array
            drink.strDrink.toLowerCase().indexOf(queryString) !== -1
        );

        searchResults.sort((a, b) => {
          a = a.strDrink.toLowerCase();
          b = b.strDrink.toLowerCase();

          // searchQuery.value = searchQuery.value.toLowerCase();
          if (a.startsWith(queryString) && !b.startsWith(queryString)) {
            return -1;
          }
          if (!a.startsWith(queryString) && b.startsWith(queryString)) {
            return 1;
          }
          if (a.startsWith(queryString) && b.startsWith(queryString)) {
            return a.localeCompare(b);
          }
        });
      }
      return searchResults;
    });

    const limitedDrinkResults = computed(() => {
      return searchedDrinks.value.slice(0, numResults);
    });

    //prevents searching of empty string
    watchEffect((searchQuery) => {
      searchValid.value = searchQuery != "";
    });

    populateDrinks();
    return {
      drinks,
      searchQuery,
      searchedDrinks,
      numResults,
      limitedDrinkResults,
      search,
      closeSearch,
      searchValid,
    };
  },
};
</script>

<style scoped>
.searchResults {
  background-color: #262626 !important;
  color: white;
  border: none;
}
.moreResults {
  background-color: black !important;
  color: white;
}

.noResults {
  background-color: black !important;
  color: white;
}
.noResults:hover {
  background-color: black !important;
  color: white;
}
.moreResults:hover {
  background-color: #414551 !important;
  color: white;
}
.searchResults:hover {
  background-color: #414551 !important;
  color: white;
}
.searchLink {
  text-decoration: none !important;
}
.searchBtn {
  color: white;
  border-left: none;
  border-color: lightgrey;
}
/* .searchBtn:hover {
  background-color: #414551;
} */

button:active{
transform: scale(0.9);
}

/* no hover styling - bg same as no state */
button:hover{
  background-color: #212529;
}
/* Apply hover style on devices where hover behaves properly (hover style sticks on iphone safari) */
@media (hover: hover) {
    button:hover {
        background-color: #414551;
    }
}

/* .searchContainer { */
/* prevents left border flicker of search input on nav expand */
/* padding-left: 5px;
} */

/* .searchLink {
  color: white !important;
  font-size: var(--mdb-body-font-size);
}



.searchBtn {
  border-color: grey;
}

.form-outline .form-control:focus ~ .form-notch .form-notch-leading {
  border-top: 0.125rem solid lightgrey !important;
  border-bottom: 0.125rem solid lightgrey !important;
  border-left: 0.125rem solid lightgrey !important;
}

.form-outline .form-control:focus ~ .form-notch .form-notch-trailing {
  border-top: 0.125rem solid lightgrey !important;
  border-right: 0.125rem solid lightgrey !important;
  border-bottom: 0.125rem solid lightgrey !important;
}

.form-outline .form-control:focus ~ .form-notch .form-notch-middle {
  border-top: 0;
  border-bottom: 0.125rem solid lightgrey !important;
}

.form-label {
  color: lightgrey !important;
}

.btn-outline-light:active {
  color: lightgrey !important;
  border-color: lightgrey;
}
.btn-outline-light:hover {
  border-color: lightgrey;
} */
/* search btn focus color after click */
/* .searchBtn.btn-check:focus + .searchBtn.btn-dark,
.searchBtn.btn-dark:focus {
  border-color: grey;
  background-color: lightgrey;
  color: black !important;
} */

/* .searchInput.form-control {
  border-radius: 0px !important;
  color: white !important;
}
.form-outline .form-control ~ .form-notch .form-notch-leading {
  border-radius: 0 0 0 0;
}
.form-outline .form-control ~ .form-notch .form-notch-trailing {
  border-radius: 0px !important;
} */
</style>
