<template>
  <div class="container">
    <section class="section mx-2">
      <h1 class="title is-3 mb-0_5 has-text-black">
        {{ pageStore.evaluationInitiationPage.dashboardTitle }}
      </h1>
      <h2 class="is-size-5 mb-1 is-family-secondary">
        {{ assessmentStore.currentAssessment.municipality.name }}
      </h2>
      <RichText
        v-if="pageStore.evaluationInitiationPage.dashboardDescription"
        class="is-family-secondary mb-2"
        :rich-text="pageStore.evaluationInitiationPage.dashboardDescription"
      ></RichText>
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
import { usePageStore } from "~/stores/pageStore"

definePageMeta({
  title: "Localisation",
  step: "role",
  middleware: ["assessment", "user-step"],
})

const pageStore = usePageStore()
if (!pageStore.evaluationInitiationPage.dashboardTitle) {
  pageStore.getEvaluationInitiationPage()
}

const assessmentStore = useAssessmentStore()
</script>

<style scoped lang="sass"></style>
