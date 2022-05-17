<template>
  <div class="container is-tight">
    <Question :question-id="5" :color="color" />
  </div>
</template>

<script setup lang="ts">
import { PillarName, PillarParams } from "~/composables/types"

const pillarName = ref<string>(PillarName.PARTICIPATION)
const color = computed<string>(() =>
  pillarName.value ? PillarParams[pillarName.value].color : ""
)
</script>

<style scoped lang="sass"></style>
