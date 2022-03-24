<template>
  <div>
    <div>
      <Navbar />
      <!-- TODO insert breadcrumbs -->
      <slot></slot>
      <Footer />
    </div>
    <Toast :message="errorStore.message" />
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "~/stores/userStore"
import { useErrorStore } from "~~/stores/errorStore"

const userStore = useUserStore()
const errorStore = useErrorStore()

if (!userStore.email) {
  // if profile is already got from SSR, do not fetch again
  userStore.refreshProfile()
}
</script>
