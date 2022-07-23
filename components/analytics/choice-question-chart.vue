<template>
  <div class="choice-question-chart">
    <div
      class="choice-question-chart-grid mb-1"
      :class="`has-text-${color}-hover`"
    >
      <div>Réponse(s)</div>
      <div>Résultat(s)</div>
      <div>Totaux</div>
    </div>
    <div class="choice-question-chart-grid">
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
        >
        </AnalyticsChoiceQuestionChartLine>
        <div
          v-if="(index - 1) % fullLineModulo === 0"
          class="choice-question-chart-line-number"
          :class="`has-text-${color}-hover`"
          :style="
            getLeftStyle(
              index - 1,
              percentageOfSpaceAlreadyTaken,
              totalSeparator,
              gapSize,
              percentageSize
            )
          "
        >
          {{ (index - 1) * 10 }}%
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getPercentage } from "assets/utils/percentage"
import { getLeftStyle } from "assets/utils/choice-question-chart"

const props = defineProps({
  data: { type: Object, required: true },
  color: { type: String },
})
const totalSeparator = 11
const fullLineModulo = 5
const percentageOfSpaceAlreadyTaken = 0.25
const gapSize = 2
const percentageSize = 80
</script>

<style scoped lang="sass">
.choice-question-chart
  &-grid
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

  &-line-number
     position: absolute
     bottom: 0
     transform: translate(-50%, 100%)
</style>
