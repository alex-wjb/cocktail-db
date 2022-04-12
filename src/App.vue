<template>
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </div>
  <!-- <keep-alive include="Home"> -->
 <router-view>
  
 </router-view>
 <!-- </keep-alive> -->
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
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
</style>
