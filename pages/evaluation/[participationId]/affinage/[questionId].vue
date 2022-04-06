<template>
  <div class="container is-tight pillar-try">
    <Question
      :question-id="questionId"
      :color="color"
      context="profiling"
      :use-journey="useProfilingJourney"
    />
  </div>
</template>

<script setup lang="ts">
import { useProfilingJourney } from "~/composables/journey"

definePageMeta({
  title: "Affinage",
  breadcrumb: "affinage",
  // middleware: ["participation"],
})

const route = useRoute()
const questionId: number = +route.params.questionId
const color = ref("no-pillar")
</script>

<style scoped lang="sass"></style>
