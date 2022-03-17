<template>
  <span class="rich-text" v-html="richText"></span>
</template>

<script setup lang="ts">
import { computed } from "vue"

const props = defineProps({
  richText: { type: String, required: true },
})
</script>

<style scoped lang="sass">
.rich-text >>> ol
  margin-left: 1.5rem
.rich-text >>> ul
  margin-left: 1.5rem
  list-style-type: inherit
</style>
