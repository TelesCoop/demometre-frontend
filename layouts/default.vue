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
import { useUserStore } from "~/stores/userStore"
import { useDefinitionStore } from "~/stores/definitionStore"
import { useToastStore } from "~~/stores/toastStore"

const userStore = useUserStore()
const definitionStore = useDefinitionStore()
const toastStore = useToastStore()

if (!userStore.email) {
  // if profile is already got from SSR, do not fetch again
  userStore.refreshProfile()
}
definitionStore.getDefinitions()
</script>

<style scoped lang="sass">
.has-navbar-fixed-top
  padding-top: 75px
</style>
