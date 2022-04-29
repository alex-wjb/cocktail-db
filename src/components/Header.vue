<template>
  <MDBNavbar expand="lg" dark bg="dark" position="top" container="md">
    <MDBNavbarBrand href="#">Cocktail Database</MDBNavbarBrand>
    <MDBNavbarToggler
      @click="collapse1 = !collapse1"
      target="#navbarSupportedContent"
    ></MDBNavbarToggler>
    <MDBCollapse v-model="collapse1" id="navbarSupportedContent">
      <MDBNavbarNav
        class="mb-2 mb-lg-0"
      >
        <MDBNavbarItem to="/"> Home </MDBNavbarItem>
        <MDBNavbarItem to="/about"> About </MDBNavbarItem>
      </MDBNavbarNav>
      <SearchBar />
    </MDBCollapse>
  </MDBNavbar>
  <div :class="topPadding"></div>
</template>

<script>
import {
  MDBNavbar,
  MDBNavbarToggler,
  MDBNavbarBrand,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBCollapse,
} from "mdb-vue-ui-kit";
import SearchBar from "../components/SearchBar.vue";
import { ref, watchEffect } from "vue";
export default {
  components: {
    MDBNavbar,
    MDBNavbarToggler,
    MDBNavbarBrand,
    MDBNavbarNav,
    MDBNavbarItem,
    MDBCollapse,
    SearchBar,
  },
  setup() {
    const collapse1 = ref(false);
    const dropdown1 = ref(false);
    const topPadding = ref("");
    watchEffect(() => {
      if (collapse1.value) {
        topPadding.value = "expandedPadding";
      } else {
        topPadding.value = "collapsedPadding";
      }
    });
    return {
      collapse1,
      dropdown1,
      topPadding,
    };
  },
};
</script>

<style scoped>
a.router-link-active {
  color: white !important;
}

/* prevents navbar obstructing main content */
@media (max-width: 991.98px) {
  .expandedPadding {
    padding-bottom: 125px;
  }
  .collapsedPadding {
    padding-bottom: 0px;
  }
  #navbarSupportedContent.collapse.navbar-collapse.show {
    height: 0px !important ;
  }
}

/* prevents navbar bug of resizing twice on viewport expand */
@media (min-width: 991.9px) {
  #navbarSupportedContent.collapse.navbar-collapse {
    height: 0px !important ;
  }
  /* overrides height on smaller view to ensure expanded navbar still has height */
}
@media (max-width: 991.98px) {
  #navbarSupportedContent.collapse.navbar-collapse.show {
    height: 131px !important ;
  }
}
</style>
