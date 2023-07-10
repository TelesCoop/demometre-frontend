<template>
  <div>
    <h2>{{ slug }}</h2>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref } from "vue"

const route = useRoute()
const slug: Ref<number> = ref(route.params.slug)
</script>
