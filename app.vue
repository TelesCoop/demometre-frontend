<template>
  <FullPageLoader v-if="mainStore.firstLoading" />
  <NuxtLayout v-else>
    <NuxtPage />
  </NuxtLayout>
</template>
<script lang="ts" setup>
import { useMainStore } from "~/stores/mainStore"

const mainStore = useMainStore()
</script>
