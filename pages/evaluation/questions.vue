<template>
  <div class="container is-tight pillar-try">
    <Question
      :question-id="2"
      :color="color"
      :use-journey="useQuestionnaireJourney"
    />
  </div>
</template>

<script setup lang="ts">
import { PillarName, PillarParams } from "~/composables/types"
import { useQuestionnaireJourney } from "~/composables/journey"

const pillarName = ref<string>(PillarName.PARTICIPATION)
const color = computed<string>(() =>
  pillarName.value ? PillarParams[pillarName.value].color : ""
)
</script>

<style scoped lang="sass"></style>
