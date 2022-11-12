import { createRouter, createWebHistory } from "vue-router";
// import Home from "../views/Home.vue";
// import NotFound from "../views/NotFound.vue";
 import getUser from "../composables/getUser";

import routes from '~pages';



//ROUTE GUARDS

// if user, redirect to home, otherwise continue to original route
// const requireSignedOut = (to, from, next) => {
//   const { currentUser } = getUser();
//   if (!currentUser.value) {
//     next();
//   } else {
//     next({ name: "Home" });
//   }
// };

// const requireSignedIn = (to, from, next) => {
//   const { currentUser } = getUser();

//   if (currentUser.value) {
//     next();
//   } else {
//     next({ name: "Home" });
//   }
// };

//redirects to home if search route is accessed with no search params
// let requireParams = (to, from, next) => {
//   if (to.params.query !== "") {
//     next();
//   } else {
//     next({ name: "Home" });
//   }
// };

// const routes = [
//   {
//     path: "/",
//     name: "Home",
//     component: Home,
//   },
//   {
//     path: "/about",
//     name: "About",
//     component: () => import("../views/About.vue"),
//   },
//   {
//     path: "/login",
//     name: "Login",
//     component: () => import("../views/Login.vue"),
//     beforeEnter: requireSignedOut,
//   },
//   {
//     path: "/register",
//     name: "Registration",
//     component: () => import("../views/Registration.vue"),
//     beforeEnter: requireSignedOut,
//   },
//   {
//     path: "/reset",
//     name: "PassReset",
//     component: () => import("../views/PassReset.vue"),
//   },
//   {
//     path: "/profile",
//     name: "Profile",
//     component: () => import("../views/Profile.vue"),
//     beforeEnter: requireSignedIn,
//   },
//   {
//     path: "/search/:query?",
//     name: "Search",
//     component: () => import("../views/SearchResults.vue"),
//     beforeEnter: requireParams,
//   },
//   {
//     path: "/drinks/:id",
//     name: "DrinkInfo",
//     component: () => import("../views/DrinkInfo.vue"),
//   },
//   {
//     path: "/:catchAll(.*)",
//     name: "NotFound",
//     component: NotFound,
//   },
// ];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    // always scroll to top
    return { top: 0 };
  },
});

router.beforeEach((to, from, next) => {
  const { currentUser } = getUser();
  console.log("YOLO");
  console.log(to.name);
  if (to.name === 'Profile' && !currentUser.value) { console.log("no user!"); next({ name: 'Home' }) }
  if (to.name === 'Login' && currentUser.value) { console.log("user"); next({ name: 'Home' }) }
  if (to.name === 'Registration' && currentUser.value) { console.log("user"); next({ name: 'Home' }) }
  else next()
})

export default router;
