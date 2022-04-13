<template>
  <div>
    <div class="mb-0_75">
      <AnalyticsThreeBubbleRate
        :score="score"
        class="mr-1_5"
      ></AnalyticsThreeBubbleRate>
      <span class="has-text-shade-500">{{
        representativityCriteria.name
      }}</span>
    </div>
    <div class="mb-0_75">
      <AnalyticsDistributionBar
        :data="distributionBarData()"
        @mouseenter-item="hoverRepresentativityCriteria = $event"
        @mouseleave-item="hoverRepresentativityCriteria = null"
      ></AnalyticsDistributionBar>
    </div>
    <div
      class="has-text-shade-500"
      :class="{
        'is-invisible': !hoverRepresentativityCriteria,
      }"
    >
      <div>{{ hoverRepresentativityCriteria?.name || "\u00a0" }}</div>
      <div class="is-size-7">
        <div>
          Représentativité actuelle :
          {{ hoverRepresentativityCriteria?.displayValue }}%
        </div>
        <div>Objectif de représentativité : {{ representativityGoal }}%</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { round } from "~/assets/utils/round"
import { ref } from "@vue/reactivity"

const props = defineProps({
  representativityCriteria: { type: Object, required: true },
})
const hoverRepresentativityCriteria = ref(null)

const distributionBarData = () => {
  return props.representativityCriteria.countByResponseChoice.map((item) => {
    return { name: item.responseChoiceName, value: item.total }
  })
}

const representativityGoal = round(
  100 / props.representativityCriteria.countByResponseChoice.length,
  2
)
// TODO : CALCULATE SCORE ! use data that the initiator filled in
const score = Math.floor(Math.random() * 3) + 1
</script>
