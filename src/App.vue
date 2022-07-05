<template>

 <Header></Header>

 <div class="pageWrapper">
 <router-view>
  
 </router-view>
 </div>
 <!-- </keep-alive> -->
 
</template>

<script>
import Header from './components/Header.vue';
  import { ref } from 'vue';
  export default {
    components: {
   Header
    },
    setup(){
      const collapse1 = ref(false);
      const dropdown1 = ref(false);
      return{collapse1, dropdown1}
    }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
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

#nav {
  padding: 45px;
  background-color: grey;
  position: fixed;
  width: 100vw;
  z-index: 999;
  overflow-x: hidden;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
  text-align: center;
  z-index: 999;
}

#nav a.router-link-exact-active {
  color: #2c3e50;
  z-index: 999;
}

/* autocomplete input styles for chrome*/
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
