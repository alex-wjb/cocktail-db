<template>
  <nav
    class="fixed-top navbar navbar-expand-lg navbar-dark bg-dark"
    style="position: fixed"
    id="navbar"
  >
    <div class="container-fluid text-center">
      <div class="navbar-brand">
        <router-link
          class="navbar-brand"
          @click="refreshHome"
          :to="{ name: 'Index' }"
        >
          <img
            class="cocktailLogo"
            alt="cocktail database logo"
            src="../assets/watercolor-title.png"
            style="display: inline-block"
          />
          <h3 class="navTitle" style="display: inline-block">
            Cocktail Database
          </h3></router-link
        >
        <div
          class="smallViewShuffle"
          style="width: 0px; display: inline-block; height: 0px"
        >
          <button
            v-if="currentRoute === 'Index'"
            color="dark"
            class="btn rounded-0 shuffleBtn"
            @click="emitShuffle"
          >
            <div class="shuffleIcon">
              <h2 style="margin: 0">
                <i class="fa-solid fa-shuffle"></i>
              </h2>
              <p style="color: white; margin: 0px">Shuffle</p>
            </div>
          </button>
        </div>
      </div>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <div></div>
        <ul
          class="navbar-nav me-auto mb-2 mb-lg-0 align-items-center"
          id="navItems"
        >
          <li class="nav-item">
            <router-link
              class="nav-link"
              @click="toggleCollapse"
              :to="{ name: 'Index' }"
            >
              Home</router-link
            >
          </li>
          <li class="nav-item">
            <router-link
              class="nav-link"
              @click="toggleCollapse"
              :to="{ name: 'About' }"
            >
              About</router-link
            >
          </li>
          <li class="nav-item" v-if="showLogin()">
            <router-link
              class="nav-link"
              @click="toggleCollapse"
              :to="{ name: 'Login' }"
            >
              Login/Register</router-link
            >
          </li>
          <li class="nav-item" v-if="loggedIn()">
            <router-link
              @click="toggleCollapse"
              class="nav-link"
              :to="{ name: 'Profile' }"
            >
              Profile</router-link
            >
          </li>
          <li class="nav-item" v-if="loggedIn()" @click="logout">
            <router-link
              @click="toggleCollapse"
              class="nav-link"
              :to="{ name: 'Index' }"
            >
              Logout</router-link
            >
          </li>
          <div style="width: 90px" class="largeViewShuffle">
            <button
              v-if="currentRoute === 'Index'"
              color="dark"
              class="btn rounded-0 shuffleBtn"
              @click="emitShuffle"
            >
              <div class="shuffleIcon">
                <h2 style="margin: 0">
                  <i class="fa-solid fa-shuffle"></i>
                </h2>
                <p style="color: white; margin: 0px">Shuffle</p>
              </div>
            </button>
          </div>
        </ul>

        <SearchBar @searchEvent="toggleCollapse" />
      </div>
    </div>
  </nav>
</template>

<script>
import getUser from "../composables/getUser";
import SearchBar from "./SearchBar.vue";
import { ref, watchEffect } from "vue";
import { getAuth, signOut } from "firebase/auth";
import { useRouter, useRoute } from "vue-router";
import { Collapse } from "bootstrap";
export default {
  emits: ["shuffle"],
  components: {
    SearchBar,
  },
  setup(props, context) {
    const router = useRouter();
    const route = useRoute();
    const currentRoute = ref("");
    const auth = getAuth();
    const { currentUser } = getUser();

    //toggles bootstrap collapse
    const toggleCollapse = () => {
      const navEle = document.getElementById("navbarSupportedContent");
      if (Collapse.getInstance(navEle)) {
        if (navEle.classList.contains("show")) {
          Collapse.getInstance(navEle).toggle();
        }
      }
    };

    const refreshHome = () => {
      if (currentRoute.value === "Index") {
        router.go();
      }
    };

    const emitShuffle = () => {
      context.emit("shuffle");
    };
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
      currentRoute.value = route.name;
      toggleCollapse();
    });

    return {
      loggedIn,
      showLogin,
      logout,
      currentRoute,
      toggleCollapse,
      emitShuffle,
      refreshHome,
    };
  },
};
</script>

<style scoped>
/* a.router-link-active {
  color: white !important;
} */

.navTitle {
  font-family: "Pacifico";
}

.navbar {
  box-shadow: 0 4px 8px 0 rgb(0 0 0 / 20%), 0 6px 20px 0 rgb(0 0 0 / 19%);
}
.navHeading {
  margin-top: 0;
  margin-bottom: 0;
  font-size: 20px;
}

.shuffleBtn {
  background: #212529;
  border: none;
  margin: auto;
  /* display: block!important; */
  /* border: 2px solid green; */
}

.shuffleIcon {
  color: white;
}
.shuffleIcon:hover {
  color: white;
}

.shuffleIcon:active {
  color: grey;
}

/* if device supports proper hover behaviour */
@media (hover: hover) {
  .shuffleIcon:hover {
    color: grey;
  }
}

.cocktailLogo {
  width: 50px;
  margin-right: 10px;
  margin-bottom: 10px;
}

.nav-link {
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 10px;
  /* color:white; */
}

.nav-link:hover {
  background-color: #414551;
  border-radius: 10px;
}
.smallViewShuffle {
  visibility: visible;
}

.largeViewShuffle {
}
@media (min-width: 992px) {
  .smallViewShuffle {
    visibility: hidden;
  }
}

@media (max-width: 400px) {
  .navTitle {
    font-size: medium;
  }
}

@media (max-width: 991.98px) {
  .largeViewShuffle {
    visibility: hidden;
    height: 0px;
    position: absolute;
  }
  #navbarSupportedContent {
    border-top: 4px solid rgba(0, 0, 0, 0.175);
  }
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
}
/* overrides height on smaller view to ensure expanded navbar still has height */

@media (max-width: 991.98px) {
  #navbarSupportedContent.collapse.navbar-collapse.show.loggedOutHeight {
    height: auto !important ;
  }
  #navbarSupportedContent.collapse.navbar-collapse.show.loggedInHeight {
    height: auto !important ;
  }
}
</style>
