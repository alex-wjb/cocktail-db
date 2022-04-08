<template>
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </div>
  <router-view />
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
  padding: 40px;
  background-color: grey;
  position: fixed;
  width: 100%;
  z-index: 999;
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
