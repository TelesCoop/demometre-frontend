<template>
  <div class="container">
    <p>{{ assessmentStore.currentAssessment }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "@vue/reactivity"
import { useAssessmentStore } from "~/stores/assessmentStore"

const assessmentStore = useAssessmentStore()
</script>

<style scoped lang="sass">
</style>
