<template>
  <metainfo></metainfo>
  <Header @shuffle="shuffle"></Header>

  <div class="pageWrapper">
    <router-view :shuffle="activateRandom"> </router-view>
  </div>
</template>

<script>
import Header from "./components/Header.vue";
import { useMeta } from "vue-meta";
import { ref } from "vue"
export default {
  components: {
    Header,
  },
  setup() {
    let activateRandom = ref(false);
    useMeta({
      title: "The Cocktail Database - Classic Cocktail Recipes",
      description:
        "Browse recipes for over 600 cocktails.",
      htmlAttrs: { lang: "en", amp: true },
    });
    const shuffle = () => {
      activateRandom.value = !activateRandom.value;
    }
    return { activateRandom, shuffle};
  },
};
</script>

<style>
#app {
  /* Global vue app font */
  /* font-family: Avenir, Helvetica, Arial, sans-serif; */
  /* font-family: Georgia, Times, "Times New Roman", serif; */
  font-family: 'Montserrat';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
}

/* prevents horizontal page shift due to vertical scrollbar toggling */
html {
  overflow-y: scroll;
  background-color: lightgrey;
}




.pageWrapper {
  background-color: lightgrey;
 
  /* good card color: #0E1B40; */
  min-height: 100vh;
  /* padding-top: 125px; */
  padding-top: 125px;
  width: 100%;
  overflow-x: hidden;
  padding-bottom: 25px;
  padding-left: 25px;
  padding-right: 25px;
}
/* Feature Query */
/* @supports (padding: max(0px)) { */
/* .wrapper { */
/* uses constant value provided by IOS to provide padding when iphone horizontal to
      prevent device sensor bar covering content */
/* When vertical the constant will be 0, so padding will default to
      other specified value when using max() */
/* padding-left: max(25px, env(safe-area-inset-left));
    padding-right: max(25px, env(safe-area-inset-right)); */
/* } */
/* } */

/* .form-outline .form-control:focus {
    box-shadow: null;
} */

/* CHROME input element autocomplete styles*/
/* input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active,
textarea:-webkit-autofill,
textarea:-webkit-autofill:hover,
textarea:-webkit-autofill:focus,
select:-webkit-autofill,
select:-webkit-autofill:hover,
select:-webkit-autofill:focus
{
  border: 0;
  -webkit-text-fill-color: white;
  background-color: #262626;
  -webkit-box-shadow: 0 0 0px 30px #262626 inset!important;
  transition: background-color 5000s ease-in-out 0s;
} */
</style>
