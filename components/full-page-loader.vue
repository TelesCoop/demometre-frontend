<template>
  <div
    class="is-flex is-flex-direction-column is-align-items-center is-justify-content-center bg-white h-100-vh is-fullwidth"
  >
    <div class="is-flex is-flex-direction-column is-align-items-center">
      <Logo />
      <i class="mt-2">Le démometre est en cours de chargement.</i>
    </div>
    <Loader
      color="participation"
      class="mt-1"
    />
  </div>
</template>
<script setup lang="ts">
import Logo from "~/components/header/logo.vue"
</script>
