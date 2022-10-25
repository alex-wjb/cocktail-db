<template>
 <metainfo></metainfo>
  <Header></Header>

  <div class="pageWrapper">
    <router-view> </router-view>
  </div>
 
</template>

<script>
import Header from "./components/Header.vue";
import { useMeta } from 'vue-meta'
export default {
  components: {
    Header,
  },
  setup(){
     useMeta({
      title: 'Cocktail Database',
      description: 'Search recipes, instructions, ingredients and photos for over 600 cocktails.',
      htmlAttrs: { lang: 'en', amp: true }
    })
  }
};
</script>

<style>
#app {
  /* Global vue app font */
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

.pageWrapper {
  background-color: lightgrey;
  min-height: 100vh;
  padding-top: 115px;
  width: 100%;
  overflow-x: hidden;
  padding-bottom: 25px;
  padding-left: 25px;
  padding-right: 25px;
}

/* CHROME input element autocomplete styles*/
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
textarea:-webkit-autofill,
textarea:-webkit-autofill:hover,
textarea:-webkit-autofill:focus,
select:-webkit-autofill,
select:-webkit-autofill:hover,
select:-webkit-autofill:focus {
  border: 0;
  -webkit-text-fill-color: white;
  background-color: #262626;
  -webkit-box-shadow: 0 0 0px 1000px #262626 inset;
  transition: background-color 5000s ease-in-out 0s;
}
</style>
