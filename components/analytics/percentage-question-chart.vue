<template>
  <div v-if="data.ranges.length" class="percentage-chart">
    {{ data }}
    <div class="percentage-chart-bar" :class="`has-background-${color}-hover`">
      <span>
        <span
          class="percentage-chart-bar-line"
          :class="`has-background-${color}-hover`"
          style="left: 0%"
        ></span>
        <span
          v-for="index in data.ranges.length"
          :key="`line_${index}`"
          class="percentage-chart-bar-line"
          :class="`has-background-${color}-hover`"
          :style="`left: ${getXPosition(index, data.ranges.length)}%`"
        ></span>
      </span>

      <span>
        <span
          class="percentage-chart-bar-line-value"
          :class="`has-text-${color}-hover`"
          style="left: 0%"
          >{{ data.ranges[0].lowerBound }}%</span
        >
        <template v-for="(range, index) in data.ranges" :key="range.id">
          <span
            class="percentage-chart-bar-line-value"
            :class="`has-text-${color}-hover`"
            :style="`left: ${getXPosition(index + 1, data.ranges.length)}%`"
            >{{ range.upperBound }}%</span
          >
        </template>
      </span>

      <span>
        <template v-for="(range, index) in data.ranges" :key="index">
          <span
            class="percentage-chart-bar-interval-score"
            :class="`has-text-${color}-hover`"
            :style="`left: ${
              getXPosition(index + 1, data.ranges.length) -
              getXPosition(1, data.ranges.length) / 2
            }%`"
            ><AnalyticsScore
              class="has-text-black"
              :score="range.score"
              :show-number="true"
              :color="color"
              :size-circles="9"
              size-number-class="is-size-6"
            ></AnalyticsScore
          ></span>
        </template>
      </span>

      <!--      lol-->
      <!--      <span-->
      <!--        class="percentage-chart-bar-line-value"-->
      <!--        :class="`has-text-${color}-hover`"-->
      <!--        :style="`left: ${valuePosition}%`"-->
      <!--        >{{ data.value.value }}%</span-->
      <!--      >-->
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"

const props = defineProps({
  data: { type: Object, required: true },
  color: { type: String },
})
const getXPosition = (index: number, length: number): number => {
  return (index / length) * 100
}
// const valuePosition = computed(() => {
//   if (!props.data.ranges.length) {
//     return 0
//   }
//
//   const rangeIndex = props.data.ranges?.findIndex(
//     (range) =>
//       props.data.value.value >= range.lowerBound &&
//       props.data.value.value <= range.upperBound
//   )
//   const currentRange = props.data.ranges?.[rangeIndex]
//   const percentageBetweenBound =
//     (props.data.value.value - currentRange.lowerBound) /
//     (currentRange.upperBound - currentRange.lowerBound)
//
//   return (
//     getXPosition(rangeIndex, props.data.ranges.length) + percentageBetweenBound
//   )
// })
</script>

<style scoped lang="sass">
.percentage-chart
  $chart-size: 24px
  $line-size: 2px
  &-bar
    position: relative
    height: $line-size
    margin-top: #{($chart-size - $line-size) / 2}
    margin-bottom: #{($chart-size - $line-size) / 2 + 24px} // 24px to add bottom number

    width: 100%
    &-line, &-line-value, &-interval-score
      display: flex
      position: absolute

    &-line
      top: 20%
      width: $line-size
      height: $chart-size
      transform: translate(-50%, -50%)

    &-line-value
      transform: translate(-50%, 100%)
      bottom: -16px

      &:first-child
        transform: translate(0, 100%)
      &:last-child
        transform: translate(-100%, 100%)

    &-interval-score
      transform: translate(-50%, 100%)
      bottom: -16px
</style>
