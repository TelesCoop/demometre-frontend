<template>
  <div class="container is-tight pillar-try">
    <Question :question-id="3" :color="color" />
  </div>
</template>

<script setup lang="ts">
// todo logic when to show which question
import { PillarName, PillarParams } from "~/composables/types"

const pillarName = ref<string>(PillarName.PARTICIPATION)
const color = computed<string>(() =>
  pillarName.value ? PillarParams[pillarName.value].color : ""
)
</script>

<style scoped lang="sass"></style>
