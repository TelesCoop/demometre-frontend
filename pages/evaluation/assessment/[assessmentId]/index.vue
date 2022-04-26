<template>
  <div class="container">
    <h1 class="is-size-1">
      Tableau de bord de
      {{
        assessmentStore.currentAssessment.municipality
          ? "ma commune"
          : "mon inter-communalité"
      }}
    </h1>
    <h2 class="is-size-3 mb-2">
      {{ assessmentStore.currentAssessment.municipality.name }}
    </h2>
    <ParticipationBoard
      :assessment="assessmentStore.currentAssessment"
    ></ParticipationBoard>
    <div class="buttons mt-4">
      <NuxtLink
        :to="`/evaluation/assessment/${assessmentStore.currentAssessmentId}/participation`"
        class="button is-normal is-rounded"
        ><span>Poursuivre l'évaluation</span>
        <span class="icon"> <icon size="16" name="arrow-right-line" /> </span
      ></NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAssessmentStore } from "~/stores/assessmentStore"

definePageMeta({
  title: "Localisation",
  breadcrumb: "Localisation",
  middleware: ["assessment"],
})

const assessmentStore = useAssessmentStore()
</script>

<style scoped lang="sass"></style>
