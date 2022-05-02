<template>
  <!-- <client-only> -->
  <div id="carousel" class="carousel">
    <slot></slot>
  </div>
  <!-- </client-only> -->
</template>

<script setup lang="ts">
import requirejs from "requirejs"
let bulmaCarousel
// import bulmaCarousel from "bulma-carousel"
if (process.browser) {
  bulmaCarousel = requirejs("bulma-carousel")
  // Initialize all elements with carousel class.
  bulmaCarousel.attach(".carousel", {
    slidesToScroll: 1,
    slidesToShow: 3,
  })
}
</script>

<style scoped lang="sass">
.rich-text :deep(ol)
  margin-left: 1.5rem
.rich-text :deep(ul)
  margin-left: 1.5rem
  list-style-type: inherit
</style>
