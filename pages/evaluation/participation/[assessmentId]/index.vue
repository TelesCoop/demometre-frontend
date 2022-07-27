<template>
  <PageSection
    :title="startParticipationTitleAndDesc[0]"
    :intro="startParticipationTitleAndDesc[1]"
    :is-first-element="true"
    :intro-is-rich-text="true"
    class="column is-8 questionnaire-container"
  >
    <form class="nav-questionnaire-container" @submit.prevent="onSubmit">
      <div
        v-if="
          assessmentStore.currentAssessment.assessmentType ===
          AssessmentType.PARTICIPATIVE.key
        "
      >
        <label class="label has-text-shade-800">{{
          pageStore.evaluationInitiationPage.addExpertTitle
        }}</label>
        <span class="is-family-secondary is-size-6 has-text-shade-600">{{
          pageStore.evaluationInitiationPage.addExpertDescription
        }}</span>
        <div class="buttons mt-1">
          <div v-for="bool of [true, false]" :key="bool" class="margin-between">
            <input
              :id="bool"
              v-model="addExpert"
              type="radio"
              :value="bool"
              class="custom-hidden white-on-black-input-checked"
              name="addExpert"
            />
            <label :for="bool" class="button is-normal">
              {{
                bool
                  ? pageStore.evaluationInitiationPage.addExpertButtonYes
                  : pageStore.evaluationInitiationPage.addExpertButtonNo
              }}
            </label>
          </div>
        </div>
      </div>
      <ParticipationConsent class="mt-1_5" type="cgu" />

      <QuestionnairePreviousButton @go-back="goBack" />

      <div class="buttons mt-4">
        <button class="button is-normal is-rounded" :disabled="disabled">
          <span>C'est parti !</span>
        </button>

        <!-- Permet d'appuyer sur entrer -->
        <input type="submit" hidden />
      </div>
    </form>
  </PageSection>
</template>

<script setup lang="ts">
import { ref } from "@vue/reactivity"
import { useAssessmentStore } from "~/stores/assessmentStore"
import { usePageStore } from "~/stores/pageStore"
import { useParticipationStore } from "~~/stores/participationStore"

definePageMeta({
  title: "Consentement",
  step: "participation",
  middleware: ["assessment", "user-step"],
})

const router = useRouter()
const pageStore = usePageStore()
const assessmentStore = useAssessmentStore()
const participationStore = useParticipationStore()

if (!pageStore.evaluationInitiationPage.searchAssessmentTitle) {
  pageStore.getEvaluationInitiationPage()
}

const addExpert = ref<boolean>(false)
const disabled = computed(() =>
  participationStore.newParticipation.consent ? false : true
)

const startParticipationTitleAndDesc = computed(() => {
  switch (assessmentStore.currentAssessment.assessmentType) {
    case AssessmentType.QUICK.key:
      return [
        pageStore.evaluationInitiationPage.oneQuickAssessmentTitle,
        pageStore.evaluationInitiationPage.oneQuickAssessmentDescription,
      ]
    case AssessmentType.PARTICIPATIVE.key:
      return [
        pageStore.evaluationInitiationPage.oneParticipationAssessmentTitle,
        pageStore.evaluationInitiationPage
          .oneParticipationAssessmentDescription,
      ]
    case AssessmentType.WITH_EXPERT.key:
      return [
        pageStore.evaluationInitiationPage.oneAssessmentWithExpertTitle,
        pageStore.evaluationInitiationPage.oneAssessmentWithExpertDescription,
      ]
  }
})

function goBack() {
  assessmentStore.currentAssessmentId = undefined
  router.push("/evaluation/localisation")
}

async function onSubmit() {
  if (
    assessmentStore.currentAssessment.assessmentType ===
      AssessmentType.PARTICIPATIVE.key &&
    addExpert.value
  ) {
    assessmentStore.addingExpert = true
    useRouter().push(
      `/evaluation/participation/${assessmentStore.currentAssessmentId}/ajout-expert`
    )
  }
  useRouter().push(
    `/evaluation/participation/${assessmentStore.currentAssessmentId}/tableau-de-bord`
  )
}
</script>
