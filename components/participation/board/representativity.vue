<template>
  <div>
    <div class="mb-0_75">
      <AnalyticsSemaphoreRate
        :score="score"
        class="mr-1_5"
      ></AnalyticsSemaphoreRate>
      <span class="has-text-shade-500">
        {{ representativity.representativityCriteriaName }}
      </span>
    </div>
    <div class="mb-0_75">
      <AnalyticsDistributionBar
        :data="distributionBarData()"
        @mouseenter-item="hoverRepresentativity = $event"
        @mouseleave-item="hoverRepresentativity = null"
      ></AnalyticsDistributionBar>
    </div>
    <div v-if="hoverRepresentativity" class="has-text-shade-500">
      <div class="has-text-weight-bold">
        {{ hoverRepresentativity?.name || "\u00a0" }}
      </div>
      <div class="is-size-7">
        <div>
          Représentativité actuelle :
          {{ hoverRepresentativity?.displayValue }}%
        </div>
        <div v-if="!hoverRepresentativity?.ignoreThreshold">
          Seuil minimal de représentativité :
          {{ props.representativity.acceptabilityThresholdConsidered }}%
        </div>
      </div>
    </div>
    <div v-else class="has-text-shade-350">
      <div class="has-text-weight-bold">
        {{ representativity.representativityCriteriaName }}
      </div>
      <div class="is-size-7">
        <div>Représentativité actuelle : ...%</div>
        <div v-if="!hoverRepresentativity?.ignoreThreshold">
          Seuil minimal de représentativité : ...%
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from "vue"
import { ref } from "@vue/reactivity"
import { AssessmentRepresentativity } from "~/composables/types"

const props = defineProps({
  representativity: {
    type: Object as PropType<AssessmentRepresentativity>,
    required: true,
  },
})
const hoverRepresentativity = ref(null)

const distributionBarData = () => {
  return props.representativity.countByResponseChoice.map((item) => {
    return {
      name: item.responseChoiceName,
      value: item.total,
      ignoreThreshold: item.ignoreForAcceptabilityThreshold,
    }
  })
}

const score = computed(() => (props.representativity.respected ? 2 : 1))
</script>
