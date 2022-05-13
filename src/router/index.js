import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import NotFound from "../views/NotFound.vue";
// import { auth } from "../firebase/config";

//ROUTE GUARDS
import getUser from "../composables/getUser";
// if user redirect to home, otherwise continue to original route
// const requireSignedOut = (to, from, next) =>
//   auth.currentUser ? next({ name: "Home" }) : next();

const requireSignedOut = (to, from, next) => {
  const { currentUser } = getUser();
  if (!currentUser.value) {
    next();
  } else {
    next({ name: "Home" });
  }
};

const requireSignedIn = (to, from, next) => {
  const { currentUser } = getUser();

  if (currentUser.value) {
    next();
  } else {
    next({ name: "Home" });
  }
};
//  const requireSignedIn = (to, from, next) => !auth.currentUser ? next({ name: 'Login' }) : next();

//redirects to home if search route is accessed with no search params
let requireParams = (to, from, next) => {
  if (to.params.query !== "") {
    next();
  } else {
    next({ name: "Home" });
  }
};

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
  {
    path: "/login",
    name: "Login",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/Login.vue"),
    beforeEnter: requireSignedOut,
  },
  {
    path: "/register",
    name: "Registration",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(
        /* webpackChunkName: "registration" */ "../views/Registration.vue"
      ),
    beforeEnter: requireSignedOut,
  },
  {
    path: "/reset",
    name: "PassReset",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "passReset" */ "../views/PassReset.vue"),
  },
  {
    path: "/profile",
    name: "Profile",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "profile" */ "../views/Profile.vue"),
    beforeEnter: requireSignedIn,
  },
  {
    path: "/search/:query?",
    name: "Search",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(
        /* webpackChunkName: "searchResults" */ "../views/SearchResults.vue"
      ),
    beforeEnter: requireParams,
  },
  {
    path: "/drinks/:id",
    name: "DrinkInfo",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "drinkInfo" */ "../views/DrinkInfo.vue"),
  },
  {
    path: "/:catchAll(.*)",
    name: "NotFound",
    component: NotFound,
  },
  // {
  //   path: '**/index.html',
  //   beforeEnter: (to, from, next) => {
  //     next('/')
  //   }
  // }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    // always scroll to top
    return { top: 0 };
  },
});

export default router;
