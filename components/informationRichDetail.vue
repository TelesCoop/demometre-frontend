<template>
  <div>
    <p class="has-text-shade-400 is-uppercase is-size-6 mb-0_5">
      {{ title }}
    </p>
    <!-- disabling eslint because the v-html is alright, value is clean from backend -->
    <!-- eslint-disable -->
    <div
      v-if="value"
      class="has-text-shade-600 is-size-5 content"
      v-html="value"
    />
    <!-- eslint-enable -->
    <p
      v-else
      class="has-text-shade-600 is-size-5 is-italic"
    >
      Cette section est pour l'instant vide
    </p>
  </div>
</template>
<script setup lang="ts">

defineProps({
  title: { type: String, required: true },
  value: { type: String, required: true }
})
</script>
