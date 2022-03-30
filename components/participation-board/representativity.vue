<template>
  <div>
    <div class="mb-0_75">
      <AnalyticsThreeBubbleRate
        :score="item.score"
        class="mr-1_5"
      ></AnalyticsThreeBubbleRate>
      <span class="has-text-shade-500">{{ item.title }}</span>
    </div>
    <div class="mb-0_75">
      <AnalyticsDistributionBar
        :data="item.data"
        @mouseenter-item="hoverItem = $event"
        @mouseleave-item="hoverItem = null"
      ></AnalyticsDistributionBar>
    </div>
    <div
      class="has-text-shade-500"
      :class="{
        'is-invisible': !hoverItem,
      }"
    >
      <div>{{ hoverItem?.metadata.title || "\u00a0" }}</div>
      <div class="is-size-7">
        <div>Représentativité actuelle : {{ hoverItem?.displayValue }}%</div>
        <div>
          Objectif de représentativité : {{ round(100 / item.data.length, 2) }}%
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { round } from "~/assets/utils/round"
import { ref } from "@vue/reactivity"

const props = defineProps({
  item: { type: Object, required: true },
})
const hoverItem = ref(null)
</script>
