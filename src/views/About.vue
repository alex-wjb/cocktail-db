<template>
  <!-- <div class="about"> -->
    <PageWrapper>
    <body>
      <h4 class="about-text">
        This app uses data from
        <a href="https://www.thecocktaildb.com/"> TheCocktailDB.com</a>
      </h4>
    </body>
    </PageWrapper>
  <!-- </div> -->
</template>

<script>
import PageWrapper from "../components/PageWrapper";
export default {
  components:{ PageWrapper }
  
}
</script>

<style>
.about {
  padding-top: 80px;
  background-color: lightgrey;
  min-height: 100vh;
}
.about-text {
  background-color: lightgrey;
  padding-top: 2%;
}
</style>
