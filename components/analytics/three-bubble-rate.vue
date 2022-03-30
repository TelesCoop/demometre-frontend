<template>
  <div class="three-bubble-rate">
    <span
      v-for="(color, index) in COLORS"
      :key="color"
      :class="[index + 1 === score && `has-background-${color}`]"
      :title="index + 1 === score"
      class="has-border-shade-600 three-bubble-rate-circle"
    />
  </div>
</template>

<script setup lang="ts">
const COLORS = ["warning-main", "secondary-main", "primary-main"]

const props = defineProps({
  score: { type: Number, required: true },
})
</script>

<style scoped lang="sass">
.three-bubble-rate
  display: inline-block

  &-circle
    border: 1px solid black
    width: 15px
    height: 15px
    border-radius: 50%
    margin: 2px
    display: inline-block
    vertical-align: middle
</style>
