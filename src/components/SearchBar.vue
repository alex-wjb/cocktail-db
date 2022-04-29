<template>
  <div class="searchContainer">
    <form class="d-flex input-group w-auto">
      <MDBInput inputGroup label="Search Drinks" v-model="searchQuery"
        ><MDBBtn
          id="button-addon2"
          class="searchBtn"
          color="dark"
          outline="light"
        >
          Search
        </MDBBtn></MDBInput
      >
    </form>
    <!-- </form> -->
    <div style="width: auto; position: relative !important">
      <div style="position: absolute !important; width: 100%">
        <MDBDropdownMenu
          class="rounded-0 searchResults"
          dark
          static
          v-if="searchQuery"
        >
          <router-link
            v-for="item in limitedDrinkResults"
            :key="item"
            class="searchLink dropdown-item"
            :to="{ name: 'DrinkInfo', params: { id: item.idDrink } }"
            >{{ item.strDrink }}</router-link
          >

          <MDBDropdownItem
            v-if="searchedDrinks.length > numResults"
            tag="button"
            >{{ searchedDrinks.length }} More Results...</MDBDropdownItem
          >
        </MDBDropdownMenu>
      </div>
    </div>
  </div>
</template>

<script>
import {
  MDBBtn,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBInput,
} from "mdb-vue-ui-kit";
import getAllCocktails from "../composables/fetchCocktails.js";
import { ref, computed } from "vue";
export default {
  components: {
    MDBBtn,
    MDBDropdownMenu,
    MDBDropdownItem,
    MDBInput,
  },
  setup() {
    const drinks = ref(null);
    const { allCocktails, fetchData, error } = getAllCocktails();
    const searchQuery = ref("");
    const numResults = 5;

    const populateDrinks = async () => {
      await fetchData();
      if (error.value) {
        return;
      }
      drinks.value = allCocktails.value;
    };

    const searchedDrinks = computed(() => {
      let searchResults = drinks.value.filter(
        (drink) =>
          //if there is an occurence of the search string in the
          //drink name, then return true and
          //add to the new filtered array
          drink.strDrink
            .toLowerCase()
            .indexOf(searchQuery.value.toLowerCase()) !== -1
      );

      searchResults.sort((a, b) => {
        a = a.strDrink.toLowerCase();
        b = b.strDrink.toLowerCase();
        searchQuery.value = searchQuery.value.toLowerCase();
        if (
          a.startsWith(searchQuery.value) &&
          !b.startsWith(searchQuery.value)
        ) {
          return -1;
        }
        if (
          !a.startsWith(searchQuery.value) &&
          b.startsWith(searchQuery.value)
        ) {
          return 1;
        }
        if (
          a.startsWith(searchQuery.value) &&
          b.startsWith(searchQuery.value)
        ) {
          return a.localeCompare(b);
        }
      });
      //LIMIT SEARCH RESULTS
      //searchResults = searchResults.slice(0,numResults);
      return searchResults;
    });

    const limitedDrinkResults = computed(() => {
      return searchedDrinks.value.slice(0, numResults);
    });

    populateDrinks();
    return {
      drinks,
      searchQuery,
      searchedDrinks,
      numResults,
      limitedDrinkResults,
    };
  },
};
</script>

<style>
.searchContainer{
  /* prevents left border flicker of search input on nav expand */
padding-left: 5px;
}


.searchLink {
  color: white !important;
  font-size: var(--mdb-body-font-size);
}

.dropdown-menu-dark .dropdown-item.active,
.dropdown-menu-dark .dropdown-item:active {
  background-color: #262626 !important;
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

.form-control {
  border-radius: 0px !important;
}
.form-outline .form-control ~ .form-notch .form-notch-leading {
  border-radius: 0 0 0 0;
}
.form-outline .form-control ~ .form-notch .form-notch-trailing {
  border-radius: 0px !important;
}

</style>
