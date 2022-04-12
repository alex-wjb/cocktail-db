<template>
  <body>
    <h1>Drink Info Page</h1>
    <p>The job id is {{ $route.params.id}}</p>
  </body>
</template>

<script>
import { useRoute } from 'vue-router'
export default {
  setup(){
  const route = useRoute();
  console.log(route.params.id);
}
};

</script>


<style scoped>
body{
  padding-top: 115px;
}
</style>