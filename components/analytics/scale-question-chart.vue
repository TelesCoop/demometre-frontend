<template>
  <div class="choice-question-chart">
    <div
      class="choice-question-chart-grid mb-1"
      :class="`has-text-${color}-hover`"
    >
      <div>Caractéristique(s)</div>
      <div v-for="(choice, choiceKey) in data.choices" :key="choiceKey">
        {{ choice.label }}
      </div>
    </div>
    <div class="choice-question-chart-grid">
      <template
        v-for="(category, categoryKey) in data.value"
        :key="categoryKey"
      >
        <div
          :class="`has-background-${color}-light`"
          class="choice-question-chart-cell has-text-right"
        >
          {{ category.label }}
        </div>
        <div
          v-for="(choice, key) in category.value"
          :key="key"
          :class="`has-background-${color}-light`"
          class="choice-question-chart-bar-cell"
        >
          <div
            class="choice-question-chart-bar"
            :class="`has-background-${color}`"
            :style="`width: ${getPercentage(choice.value, data.count)}%`"
          ></div>
          <template v-for="index in totalSeparator" :key="index">
            <AnalyticsChoiceQuestionChartLine
              class="choice-question-chart-line"
              :class="`is-${color}`"
              :index="index - 1"
              :color="color"
              :total-line="totalSeparator"
              :full-line-modulo="fullLineModulo"
              :percentage-of-space-already-taken="percentageOfSpaceAlreadyTaken"
              :gap-size="gapSize"
              :percentage-size="percentageSize"
              :left-base-margin="leftBaseMargin"
            ></AnalyticsChoiceQuestionChartLine>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getPercentage } from "assets/utils/percentage"

const props = defineProps({
  data: { type: Object, required: true },
  color: { type: String },
})
const totalSeparator = 11
const fullLineModulo = 5
const percentageOfSpaceAlreadyTaken = 0
const gapSize = 0
const percentageSize = 0
const leftBaseMargin = 0
</script>

<style scoped lang="sass">
.choice-question-chart
  &-grid
    display: grid
    grid-template-columns: 135px repeat(auto-fill, 115px)
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
    position: relative

  &-line
    position: absolute
    height: 100%
    border-left-width: 1px
    border-left-style: solid
    border-left-color: var(--color-hover)

    &.is-dashed
      border-left-style: dashed
      border-left-color: var(--color)

  &-line-number
    position: absolute
    bottom: 0
    transform: translate(-50%, 100%)
</style>
