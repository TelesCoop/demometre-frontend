<template>
  <div class="has-navbar-fixed-top">
    <div>
      <HeaderNavbar />
      <Breadcrumb />
      <slot></slot>
      <Footer />
    </div>
    <Toast :message="toastStore.message" />
  </div>
</template>

<script setup lang="ts">
import { useToastStore } from "../stores/toastStore"

const toastStore = useToastStore()
</script>

<style scoped lang="sass">
.has-navbar-fixed-top
  padding-top: 75px
</style>
