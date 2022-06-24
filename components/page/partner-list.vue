<template>
  <div
    class="is-flex is-flex-direction-row is-flex-wrap-wrap"
    :style="`column-gap: ${props.columnGap}`"
  >
    <figure v-for="partner of props.partners" :key="partner.id" class="image">
      <img
        :src="MADIA_BASE_URL + partner.logoImageUrl"
        :alt="partner.name"
        :style="`height: ${props.logoHeight}px`"
      />
    </figure>
  </div>
</template>

<script setup lang="ts">
import { MADIA_BASE_URL } from "~/composables/api"

const props = defineProps({
  partners: { type: Array, required: true },
  logoHeight: { type: Number, required: true },
  columnGap: { type: String, default: "4rem" },
})
</script>

<style scoped lang="sass">
img
  width: 100%
  object-fit: cover
</style>
