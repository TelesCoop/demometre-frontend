<template>
  <div class="container">
    <section class="section columns is-centered questionnaire-container">
      <div class="column is-8 nav-questionnaire-container">
        <h1 class="title is-3 has-text-black-ter">
          {{ pageStore.evaluationInitiationPage.initializationValidationTitle }}
        </h1>
        <RichText
          :rich-text="
            pageStore.evaluationInitiationPage
              .initializationValidationDescription
          "
          class="is-family-secondary"
        />

        <QuestionnairePreviousButton color="no-pillar" @go-back="goBack" />

        <button
          class="button is-shade-600 is-rounded mt-4"
          @click.prevent="submit"
        >
          <span>{{
            pageStore.evaluationInitiationPage
              .initializationValidationCallToAction
          }}</span>
          <span class="icon">
            <icon size="20" name="arrow-right-line" />
          </span>
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { usePageStore } from "~/stores/pageStore"
import { useAssessmentStore } from "~/stores/assessmentStore"

definePageMeta({
  title: "Initialisation",
  step: "initialization-objectives-questions",
  middleware: ["assessment", "user-step"],
})

const router = useRouter()
const assessmentStore = useAssessmentStore()
const pageStore = usePageStore()
if (!pageStore.evaluationInitiationPage.initializationValidationTitle) {
  pageStore.getEvaluationInitiationPage()
}

function goBack() {
  router.go(-1)
}

async function submit() {
  await assessmentStore.saveEndInitializationQuestions()
  useRouter().push("/evaluation")
}
</script>
