<template>
  <div>
    <!-- Choose Assessment type step-->
    <PageSection
      v-if="initializationSteps[currentStep] === steps.ASSESSMENT_TYPE"
      :title="pageStore.evaluationInitiationPage.noAssessmentTitle"
      :intro="pageStore.evaluationInitiationPage.noAssessmentDescription"
      :is-first-element="true"
    >
      <div class="columns mb-2">
        <div
          v-for="assessmentType in pageStore.usagePage.startAssessmentBlockData"
          :key="assessmentType.id"
          class="column is-one-third"
        >
          <PageAssessmentCard
            :assessment-type="assessmentType"
            background-color="white"
          />
        </div>
      </div>
    </PageSection>

    <!-- User not logged in can not initialize assessment-->
    <PageSection
      v-else-if="!userStore.isLoggedIn"
      class="column is-8"
      :title="pageStore.evaluationInitiationPage.mustBeConnectedToCreateTitle"
      :intro="
        pageStore.evaluationInitiationPage.mustBeConnectedToCreateDescription
      "
      :is-first-element="true"
    >
      <div class="buttons mb-0_5">
        <NuxtLink class="button is-normal is-rounded" to="/signup"
          >Faire un compte</NuxtLink
        >
        <NuxtLink class="button is-normal is-rounded" to="/login"
          >Se connecter</NuxtLink
        >
      </div>
    </PageSection>

    <!-- Start initialization step -->
    <PageSection
      v-else-if="initializationSteps[currentStep] === steps.START"
      class="column is-8"
      :title="startInitializationTitleAndDesc[0]"
      :intro="startInitializationTitleAndDesc[1]"
      :is-first-element="true"
    >
      <div
        v-if="
          assessmentStore.creatingAssessmentType ===
          AssessmentType.WITH_EXPERT.key
        "
      >
        <AssessmentAddExpert
          :assessment-id="assessmentStore.currentAssessmentId"
          :initiation-page="pageStore.evaluationInitiationPage"
          :redirect-after-validation="`/evaluation/participation/${assessmentStore.currentAssessmentId}/tableau-de-bord`"
        />
      </div>
      <button class="button is-normal is-rounded mt-4" @click="goToNextStep">
        <span>C’est parti !</span>
      </button>
    </PageSection>

    <!-- Assessment Initiator step -->
    <PageSection
      v-else-if="initializationSteps[currentStep] === steps.INITIATOR"
      class="column is-8"
      :title="pageStore.evaluationInitiationPage.initTitle"
      :intro="pageStore.evaluationInitiationPage.initDescription"
      :is-first-element="true"
    >
      <form @submit.prevent="goToNextStep">
        <div class="field mb-3">
          <label class="label">
            {{ pageStore.evaluationInitiationPage.initiatorNameQuestion }}
          </label>
          <span class="is-family-secondary is-size-6">
            {{ pageStore.evaluationInitiationPage.initiatorNameDescription }}
          </span>
          <div class="control">
            <input
              v-model="initiatorName"
              class="input is-normal-width"
              type="text"
              placeholder="Mairie de ..."
            />
          </div>
        </div>
        <label class="label"
          >Au nom de qui lancez-vous cette évaluation &nbsp;?</label
        >
        <div class="buttons mt-1">
          <div
            v-for="initiatorType of InitiatorType"
            :key="initiatorType.key"
            class="margin-between"
          >
            <input
              :id="initiatorType.key"
              v-model="initiatorTypeSelected"
              type="radio"
              :value="initiatorType.key"
              class="custom-hidden white-on-black-input-checked"
              name="initiationType"
              required
            />
            <label :for="initiatorType.key" class="button is-normal locality">
              {{ initiatorType.value }}
            </label>
          </div>
        </div>
        <div class="buttons mt-4">
          <button class="button is-normal is-rounded" :disabled="disabled">
            <span>Suivant</span>
            <span class="icon">
              <icon size="20" name="arrow-right-line" />
            </span>
          </button>

          <!-- Permet d'appuyer sur entrer -->
          <input type="submit" hidden />
        </div>
      </form>
    </PageSection>

    <!-- Representativity rates step -->
    <PageSection
      v-else-if="initializationSteps[currentStep] === steps.REPRESENTATIVITY"
      class="column is-8"
      :title="pageStore.evaluationInitiationPage.representativityTitle"
      :intro="pageStore.evaluationInitiationPage.representativityDescription"
      :is-first-element="true"
      :intro-is-rich-text="true"
    >
      <form @submit.prevent="onSubmit">
        <div
          v-for="representativityCriteria of assessmentStore.representativityCriterias"
          :key="representativityCriteria.id"
        >
          <label class="label">{{ representativityCriteria.name }}</label>
          <span class="is-family-secondary is-size-6">
            Les réponses entrant en considération sont :
            <span
              v-for="(
                responseChoice, index
              ) of representativityCriteria.responseChoiceStatements"
              :key="responseChoice"
            >
              {{ responseChoice }}
              <span
                v-if="
                  index + 1 <
                  representativityCriteria.responseChoiceStatements.length
                "
                >, &nbsp;</span
              >
            </span>
          </span>
          <ResponseInputPercentage
            v-model="representativityCriteria.acceptabilityThreshold"
            class="mt-1"
            :color="color"
            :question-id="representativityCriteria.id"
          />
        </div>
        <div class="buttons mt-1_5">
          <button class="button is-normal is-rounded" :disabled="disabled">
            <span>Valider</span>
            <span class="icon">
              <icon size="24" name="check" />
            </span>
          </button>

          <!-- Permet d'appuyer sur entrer -->
          <input type="submit" hidden />
        </div>
      </form>
    </PageSection>
  </div>
</template>

<script setup lang="ts">
import { useInitializationJourney } from "~/composables/journey"
import { usePageStore } from "~/stores/pageStore"
import { InitiatorType, AssessmentType } from "~/composables/types"
import { useAssessmentStore } from "~/stores/assessmentStore"
import { useUserStore } from "~/stores/userStore"

definePageMeta({
  title: "Initialisation",
  breadcrumb: "Initialisation",
  step: "initialization",
  middleware: ["assessment"],
})

const userStore = useUserStore()

const pageStore = usePageStore()
if (!pageStore.evaluationInitiationPage.initTitle) {
  pageStore.getEvaluationInitiationPage()
}
if (!pageStore.usagePage.startAssessmentBlockData) {
  pageStore.getUsagePage()
}

const assessmentStore = useAssessmentStore()
if (assessmentStore.representativityCriterias.length === 0) {
  assessmentStore.getRepresentativityCriterias()
}

const color = ref("no-pillar")

enum steps {
  ASSESSMENT_TYPE = "assessment_type",
  START = "start",
  INITIATOR = "initiator",
  REPRESENTATIVITY = "representativity",
}
const initializationSteps = [
  steps.ASSESSMENT_TYPE,
  steps.START,
  steps.INITIATOR,
  steps.REPRESENTATIVITY,
]
const currentStep = ref<number>(assessmentStore.creatingAssessmentType ? 1 : 0)

const initiatorTypeSelected = ref<string>()
const initiatorName = ref<string>("")

watch(
  () => assessmentStore.creatingAssessmentType,
  () => {
    if (currentStep.value === 0 && assessmentStore.creatingAssessmentType) {
      currentStep.value = 1
    }
  }
)

const disabled = computed(() => {
  if (initializationSteps[currentStep.value] === steps.INITIATOR) {
    return initiatorTypeSelected.value && initiatorName.value ? false : true
  }
  return false
})

const startInitializationTitleAndDesc = computed(() => {
  switch (assessmentStore.creatingAssessmentType) {
    case AssessmentType.QUICK.key:
      return [
        pageStore.evaluationInitiationPage.createQuickAssessmentTitle,
        pageStore.evaluationInitiationPage.createQuickAssessmentDescription,
      ]
    case AssessmentType.PARTICIPATIVE.key:
      return [
        pageStore.evaluationInitiationPage.createParticipationAssessmentTitle,
        pageStore.evaluationInitiationPage
          .createParticipationAssessmentDescription,
      ]
    case AssessmentType.WITH_EXPERT.key:
      return [
        pageStore.evaluationInitiationPage.createAssessmentWithExpertTitle,
        pageStore.evaluationInitiationPage
          .createAssessmentWithExpertDescription,
      ]
  }
})

onMounted(() => {
  window.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      goToNextStep()
    }
  })
})

function goToNextStep() {
  if (initializationSteps.length - 1 > currentStep.value) {
    if (
      initializationSteps[currentStep.value + 1] === steps.REPRESENTATIVITY &&
      assessmentStore.creatingAssessmentType === AssessmentType.QUICK.key
    ) {
      onSubmit()
    } else {
      currentStep.value += 1
    }
  } else {
    onSubmit()
  }
}

async function onSubmit() {
  const isSuccess = await assessmentStore.initializeAssessment({
    initiatorType: initiatorTypeSelected.value,
    initiatorName: initiatorName.value,
  })
  if (isSuccess) {
    useInitializationJourney().goToNextQuestion(undefined)
  }
}
</script>
