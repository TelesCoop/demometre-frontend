<template>
  <div class="closed-with-scale-chart">
    <div class="closed-with-scale-chart-container">
      <div class="closed-with-scale-chart-grid mb-1">
        <div :class="`has-text-${color}-hover`">Caractéristique(s)</div>
        <div class="is-flex">
          <div
            v-for="(choice, choiceId) in props.data.choices"
            :key="choiceId"
            class="has-text-weight-bold px-0_5"
            style="flex: 1 1"
          >
            {{ choice.label }}
          </div>
        </div>
      </div>
      <div class="closed-with-scale-chart-grid">
        <template
          v-for="(category, categoryId) in data.value"
          :key="categoryId"
        >
          <div
            :class="`has-background-${color}-light`"
            class="closed-with-scale-chart-cell has-text-right has-text-weight-bold"
          >
            {{ category.label }}
          </div>
          <div class="is-flex">
            <div
              v-for="(choice, choiceId) in category.value"
              :key="choiceId"
              :class="`has-background-${color}-light`"
              class="closed-with-scale-chart-bar-cell"
              style="flex: 1 1"
            >
              <div
                class="closed-with-scale-chart-bar"
                :class="`has-background-${color}`"
                :style="`width: ${getPercentage(choice.value, data.count)}%`"
              ></div>
            </div>
          </div>
        </template>
        <template v-for="index in totalSeparator" :key="index">
          <AnalyticsChoiceQuestionChartLine
            class="closed-with-scale-chart-line"
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
        </template>
      </div>
      <template v-for="index in choiceLength + 1" :key="index">
        <AnalyticsChoiceQuestionChartLine
          class="closed-with-scale-chart-line with-header"
          style="top: 0"
          :class="`is-${color}`"
          :index="index - 1"
          :color="color"
          :total-line="choiceLength + 1"
          :full-line-modulo="1"
          :percentage-of-space-already-taken="percentageOfSpaceAlreadyTaken"
          :gap-size="gapSize"
          :percentage-size="percentageSize"
        ></AnalyticsChoiceQuestionChartLine>
      </template>
      <template v-for="index in choiceLength" :key="index">
        <div
          class="closed-with-scale-chart-line-number right-to-bar"
          :class="`has-text-${color}-hover`"
          :style="
            getLeftStyle(
              index - 1,
              percentageOfSpaceAlreadyTaken,
              choiceLength + 1,
              gapSize,
              percentageSize
            )
          "
        >
          0%
        </div>
        <div
          class="closed-with-scale-chart-line-number left-to-bar"
          :class="`has-text-${color}-hover`"
          :style="
            getLeftStyle(
              index,
              percentageOfSpaceAlreadyTaken,
              choiceLength + 1,
              gapSize,
              percentageSize
            )
          "
        >
          100%
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getPercentage } from "assets/utils/percentage"
import { getLeftStyle } from "assets/utils/charts"
import { computed } from "vue"
const props = defineProps({
  data: { type: Object, required: true },
  color: { type: String },
})
const fullLineModulo = 5
const percentageOfSpaceAlreadyTaken = 0.25
const gapSize = 1
const percentageSize = 0

const choiceLength = computed(() => {
  return Object.keys(props.data.choices).length
})

const totalSeparator = computed(() => {
  return 10 * choiceLength.value + 1
})
</script>

<style scoped lang="sass">
.closed-with-scale-chart
  padding-bottom: 2rem

  &-container
    position: relative

  &-grid
    position: relative
    display: grid
    grid-template-columns: 1fr 3fr
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

    &.with-header
      top: 0
      height: 120%

    &.is-dashed
      border-left-style: dashed
      border-left-color: var(--color)

  &-line-number
    position: absolute
    bottom: 0

    &.right-to-bar
      transform: translate(0.5rem, 120%)

    &.left-to-bar
      transform: translate(calc(-100% - 0.5rem),120%)
</style>
