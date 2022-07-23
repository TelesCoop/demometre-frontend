<template>
  <div class="choice-question-chart">
    <template v-for="(choice, key) in data.value" :key="key">
      <div
        :class="`has-background-${color}-light`"
        class="choice-question-chart-cell has-text-right"
      >
        {{ choice.label }}
      </div>
      <div
        :class="`has-background-${color}-light`"
        class="choice-question-chart-bar-cell"
      >
        <div
          class="choice-question-chart-bar"
          :class="`has-background-${color}`"
          :style="`width: ${getPercentage(choice.value, data.count)}%`"
        ></div>
      </div>
      <div
        :class="`has-background-${color}-light`"
        class="choice-question-chart-cell"
      >
        <strong>{{ getPercentage(choice.value, data.count) }}</strong
        >%
      </div>
    </template>
    <template v-for="index in separatorNumber" :key="index">
      <AnalyticsChoiceQuestionChartLine
        class="choice-question-chart-line"
        :class="`is-${color}`"
        :index="index - 1"
        :color="color"
        :total-line="separatorNumber"
        :full-line-modulo="5"
        :percentage-of-space-already-taken="0.25"
        :gap-size="2"
        :percentage-size="80"
      >
      </AnalyticsChoiceQuestionChartLine>
    </template>
  </div>
</template>

<script setup lang="ts">
import { getPercentage } from "assets/utils/percentage"

const props = defineProps({
  data: { type: Object, required: true },
  color: { type: String },
})
const separatorNumber = 11
</script>

<style scoped lang="sass">
.choice-question-chart
  position: relative
  display: grid
  grid-template-columns: 1fr 3fr 80px
  grid-gap: 1rem

  &-cell
    padding: 6px

  &-bar
    z-index: 1
    height: 22px
    border: 1px solid black

  &-bar-cell
    display: flex
    flex-direction: column
    justify-content: center

  &-line
    position: absolute
    height: 100%
    border-left-width: 1px
    border-left-style: solid
    border-left-color: var(--color-hover)

    &.is-dashed
      border-left-style: dashed
      border-left-color: var(--color)
</style>
