import { createRouter, createWebHistory} from "vue-router";
import Home from "../views/Home.vue";
import NotFound from "../views/NotFound.vue";

//redirects to home if search route is accessed with no search params
let requireParams =(to, from, next) => {
  
  if(to.params.query!==""){
    
    next()
  }
  else{
    next({name: 'Home'})
  }
}

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
    path: "/search/:query?",
    name: "Search",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "searchResults" */ "../views/SearchResults.vue"),
    beforeEnter: requireParams
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
    return { top: 0 }
  },
});


export default router;
