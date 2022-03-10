<template>
  <div>
    <Navbar />
    <slot></slot>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "~/stores/userStore"

const userStore = useUserStore()

if (!userStore.email) {
  // if profile is already got from SSR, do not fetch again
  userStore.refreshProfile()
}
</script>
