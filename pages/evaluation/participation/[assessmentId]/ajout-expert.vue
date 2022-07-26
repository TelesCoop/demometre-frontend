<template>
  <div>
    <PageSection
      class="column is-8"
      :title="
        pageStore.evaluationInitiationPage.createAssessmentWithExpertTitle
      "
      :intro="
        pageStore.evaluationInitiationPage.createAssessmentWithExpertDescription
      "
      :is-first-element="true"
    >
      <div v-if="!userStore.isLoggedIn" class="buttons mb-0_5">
        <!-- User not logged in -->
        <p>Vous devez être connecté pour ajouter un expert</p>
        <NuxtLink class="button is-normal is-rounded" to="/signup"
          >Faire un compte</NuxtLink
        >
        <NuxtLink class="button is-normal is-rounded" to="/login"
          >Se connecter</NuxtLink
        >
      </div>
      <AssessmentAddExpert
        v-else
        :assessment-id="+route.params.assessmentId"
        :initiation-page="pageStore.evaluationInitiationPage"
        :redirect-after-validation="`/evaluation/participation/${assessmentStore.currentAssessmentId}/tableau-de-bord`"
      />
    </PageSection>
  </div>
</template>

<script setup lang="ts">
import { usePageStore } from "~/stores/pageStore"
import { useUserStore } from "~/stores/userStore"

definePageMeta({
  title: "Ajout d'un expert",
  breadcrumb: "Ajout d'un expert",
  step: "participation",
  middleware: ["assessment", "user-step"],
})

const route = useRoute()
const userStore = useUserStore()
const pageStore = usePageStore()
if (!pageStore.evaluationInitiationPage.initTitle) {
  pageStore.getEvaluationInitiationPage()
}
</script>
