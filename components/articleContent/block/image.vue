<template>
  <div>
    <h2>IMAGE</h2>
    <pre>{{ block }}</pre>
  </div>
</template>

<script setup lang="ts">
import { PropType } from "vue"
import { Block } from "~/composables/types"

defineProps({
  block: {
    type: Object as PropType<Block>,
    required: true,
  },
})
</script>
