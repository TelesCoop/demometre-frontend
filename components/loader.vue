<template>
  <div class="loader-wrapper" :class="{ 'is-active': isActive }">
    <div class="loader is-loading"></div>
  </div>
</template>

<script setup lang="ts">
// TODO : manage type, warning, error, info ...
defineProps({
  isActive: { type: Boolean, default: false },
})
</script>

<style scoped lang="sass">
.loader-wrapper
  // position: absolute
  // top: 0
  // left: 0
  // height: auto
  // width: auto
  background: #fff
  opacity: 0
  z-index: -1
  transition: opacity .3s
  display: flex
  justify-content: center
  align-items: center
  border-radius: 6px

  .loader
    height: 80px
    width: 80px

  &.is-active
    opacity: 1
    z-index: 1
</style>
