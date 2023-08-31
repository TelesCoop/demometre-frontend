<template>
  <div style="min-width: 250px">
    <p class="has-text-shade-400 is-uppercase is-size-6">
      {{ title }}
    </p>
    <p class="has-text-shade-600 is-size-5">
      {{ value }}
    </p>
  </div>
</template>
<script setup lang="ts">

defineProps({
  title: { type: String, required: true },
  value: { type: String, required: true }
})
</script>
