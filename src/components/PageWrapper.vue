<template>
<div class="wrapper">
  <slot></slot>

</div>

</template>

<script>
export default {

}
</script>

<style scoped>
 .wrapper {
  background-color: lightgrey;
  min-height: 100vh;
  padding-top: 115px;
  width: 100%;
  overflow-x: hidden;
  padding-bottom: 25px;
  padding-left: 25px;
  padding-right: 25px;
}

/* Feature Query */
@supports (padding: max(0px)) {
  .wrapper {
    /* uses constant value provided by IOS to provide padding when iphone horizontal to
      prevent device sensor bar covering content */
    /* When vertical the constant will be 0, so padding will default to
      other specified value when using max() */
    padding-left: max(25px, env(safe-area-inset-left));
    padding-right: max(25px, env(safe-area-inset-right));
  }
}
</style>