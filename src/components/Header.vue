<template>
  <MDBNavbar expand="lg" dark bg="dark" position="top" container="md">
    <MDBNavbarBrand
      ><h1 class="navHeading"><router-link class="homeLink" :to="{ name: 'Index' }">
        Cocktail Database</router-link
      ></h1></MDBNavbarBrand
    >
    
    <MDBNavbarToggler
      @click="collapse1 = !collapse1"
      target="#navbarSupportedContent"
    ></MDBNavbarToggler>
    <MDBCollapse
      v-model="collapse1"
      id="navbarSupportedContent"
      :class="navHeight"
    >
      <MDBNavbarNav class="mb-2 mb-lg-0">
        <MDBNavbarItem @click.prevent="collapse1 = !collapse1" to="/">
          Home
        </MDBNavbarItem>
        <MDBNavbarItem @click.prevent="collapse1 = !collapse1" to="/about">
          About
        </MDBNavbarItem>
        <MDBNavbarItem
          v-if="showLogin()"
          @click.prevent="collapse1 = !collapse1"
          to="/login"
        >
          Login/Register
        </MDBNavbarItem>
        <MDBNavbarItem
          v-if="loggedIn()"
          @click.prevent="collapse1 = !collapse1"
          to="/profile"
        >
          Profile
        </MDBNavbarItem>
        <MDBNavbarItem
          v-if="loggedIn()"
          @click.prevent="collapse1 = !collapse1"
          @click="logout"
          to="/"
        >
          Logout
        </MDBNavbarItem>
      </MDBNavbarNav>

      <SearchBar @searchEvent="collapse1 = !collapse1" />
    </MDBCollapse>
  </MDBNavbar>
  <div :class="topPadding" class="paddingTransition"></div>
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
import getUser from "../composables/getUser";
import SearchBar from "./SearchBar.vue";
import { ref, watchEffect } from "vue";
import { getAuth, signOut } from "firebase/auth";
import { useRouter, useRoute } from "vue-router";
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
    const router = useRouter();
    const navHeight = ref("");
    const route = useRoute();
    const currentRoute = ref("");

    const auth = getAuth();
    const { currentUser } = getUser();

    const loggedIn = () => {
      if (currentUser.value) {
        return true;
      } else {
        return false;
      }
    };
    const showLogin = () => {
      if (!currentUser.value) {
        return true;
      } else {
        return false;
      }
    };
    const logout = async () => {
      try {
        await signOut(auth);
        router.go("/");
      } catch (err) {
        alert(err.message);
      }
    };

    watchEffect(() => {
      if (loggedIn()) {
        navHeight.value = "loggedInHeight";
      } else {
        navHeight.value = "loggedOutHeight";
      }
    });

    watchEffect(() => {
      currentRoute.value = route.name;
    });

    watchEffect(() => {
      if (collapse1.value) {
        if (loggedIn()) {
          topPadding.value = "expandedPaddingLogIn";
          navHeight.value = "loggedInHeight";
        } else {
          navHeight.value = "loggedOutHeight";
          topPadding.value = "expandedPadding";
        }
      } else {
        topPadding.value = "collapsedPadding";
      }
    });
    return {
      collapse1,
      dropdown1,
      topPadding,
      loggedIn,
      showLogin,
      logout,
      navHeight,
      currentRoute,
    };
  },
};
</script>

<style scoped>
a.router-link-active {
  color: white !important;
}
.navHeading{
   margin-top: 0;
    margin-bottom: 0;
    font-size: 20px;
}

/* prevents navbar obstructing main content */
@media (max-width: 991.98px) {
  .expandedPadding {
    padding-bottom: 170px;
  }
  .collapsedPadding {
    padding-bottom: 0px;
  }
  .expandedPaddingLogIn {
    padding-bottom: 210px;
  }
  /* #navbarSupportedContent.collapse.navbar-collapse.show {
    height: 0px !important ;
  } */
}
a.homeLink {
  color: white !important;
}

/* prevents navbar bug of resizing twice on viewport expand */
@media (min-width: 991.9px) {
  #navbarSupportedContent.collapse.navbar-collapse {
    height: 0px !important ;
  }
  /* overrides height on smaller view to ensure expanded navbar still has height */
}
@media (max-width: 991.98px) {
  #navbarSupportedContent.collapse.navbar-collapse.show.loggedOutHeight {
    height: auto !important ;
  }
  #navbarSupportedContent.collapse.navbar-collapse.show.loggedInHeight {
    height: auto !important ;
  }
}
</style>
