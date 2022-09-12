<template>
  <div class="container">
    <section class="section mx-2">
      <h1 class="title is-3 mb-0_5">
        Tableau de bord de
        {{
          assessmentStore.currentAssessment.municipality
            ? "ma ville"
            : "mon inter-communalité"
        }}
      </h1>
      <h2 class="is-size-5 mb-2 is-family-secondary">
        {{ assessmentStore.currentAssessment.municipality.name }}
      </h2>
      <ParticipationBoard
        :assessment="assessmentStore.currentAssessment"
      ></ParticipationBoard>
      <div class="buttons mt-4">
        <NuxtLink
          :to="`/evaluation/participation/${assessmentStore.currentAssessmentId}/role`"
          class="button is-shade-600 is-rounded"
        >
          <span>Poursuivre l'évaluation</span>
          <span class="icon">
            <icon size="16" name="arrow-right-line" />
          </span>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useAssessmentStore } from "~/stores/assessmentStore"

definePageMeta({
  title: "Localisation",
  step: "role",
  middleware: ["assessment", "user-step"],
})

const assessmentStore = useAssessmentStore()
</script>

<style scoped lang="sass"></style>
