<template>
  <div v-for="item in freeBody" :key="item.id">
    <RichText
      v-if="item.type === 'richtext'"
      :rich-text="item.value"
      class="is-family-secondary"
    />
    <img
      v-else-if="item.type === 'image'"
      :src="MADIA_BASE_URL + item.imageUrl"
      alt="img"
    />
  </div>
</template>

<script setup lang="ts">
import { MADIA_BASE_URL } from "~/composables/api"

const props = defineProps({
  freeBody: { type: Array, required: true },
})
</script>

<style scoped lang="sass"></style>
