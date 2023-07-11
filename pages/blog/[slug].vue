<template>
  <div>
    <h2>{{ slug }}</h2>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const slug = ref(route.params.slug)
</script>
