<template>
  <div class="container">
    <PageTitle title="Mon compte" subtitle="" />
    <div class="mt-1">
      <button class="button is-normal" type="button" @click="logout">
        Se déconnecter
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "~~/stores/userStore"

const userStore = useUserStore()
const logout = () => {
  userStore.logout()
}
</script>

<style scoped lang="sass"></style>
