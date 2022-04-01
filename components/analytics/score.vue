<template>
  <div class="score">
    <b class="score-number">{{ score }}</b>
    <span
      v-for="i in maxScore"
      :key="i"
      :class="
        i <= score ? `has-background-${color}` : `has-background-${color}-light`
      "
      class="score-circle"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  color: { type: String, required: true },
  score: { type: Number, required: true },
  maxScore: { type: Number, default: 4 },
})
</script>

<style scoped lang="sass">
.score
  display: block
  &-number
    vertical-align: middle

  &-circle
    width: 15px
    height: 15px
    border-radius: 100%
    margin: 2px
    display: inline-block
    vertical-align: middle
</style>
