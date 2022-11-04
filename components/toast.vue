<template>
  <Transition>
    <div id="snackbar">{{ message }}</div>
  </Transition>
</template>

<script setup lang="ts">
// TODO : manage type, warning, error, info ...
defineProps({
  message: { type: String, required: true },
})
</script>

<style scoped lang="sass">
/* The snackbar - position it at the bottom and in the middle of the screen */
#snackbar
  min-width: 250px
  margin-left: -125px
  background-color: #333
  color: #fff
  text-align: center
  border-radius: 2px
  padding: 16px
  position: fixed
  z-index: 1
  left: 50%
  bottom: 30px

/* Animations to fade the snackbar in and out */
.v-enter-active,
.v-leave-active
  transition: opacity 0.3 ease, bottom 0.3 ease

.v-enter-from,
.v-leave-to
  bottom: 0
  opacity: 0
</style>
