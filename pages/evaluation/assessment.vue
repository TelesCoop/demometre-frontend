<template>
  <div class="container">
    <p>{{ assessmentStore.currentAssessment }}</p>
    <div></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "@vue/reactivity"
import { useAssessmentStore } from "~/stores/assessmentStore"
definePageMeta({
  middleware: ["assessment"],
})

const assessmentStore = useAssessmentStore()
</script>

<style scoped lang="sass"></style>
