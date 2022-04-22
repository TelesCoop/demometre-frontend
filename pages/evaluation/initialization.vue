<template>
  <div class="container">
    <section class="columns is-centered">
      <!-- Start initialization -->
      <div
        v-if="initializationSteps[currentStep] === steps.START"
        class="column is-8"
      >
        <h1 class="title is-3 has-text-black-ter">
          {{ pageStore.evaluationInitPage.title }}
        </h1>
        <RichText
          :rich-text="pageStore.evaluationInitPage.introduction"
          class="is-family-secondary"
        />

        <button class="button is-normal is-rounded mt-4" @click="goToNextStep">
          <span>Initialiser une évaluation</span>
          <span class="icon">
            <icon size="20" name="arrow-right-line" />
          </span>
        </button>
      </div>
      <!-- Assessment Initiator  -->
      <div
        v-if="initializationSteps[currentStep] === steps.INITIATOR"
        class="column is-8"
      >
        <h1 class="title is-3 has-text-black-ter">
          Lancement d'une nouvelle évaluation
        </h1>

        <form @submit.prevent="goToNextStep">
          <div class="field my-3">
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
                  name="initiatorType"
                  required
                />
                <label
                  :for="initiatorType.key"
                  class="button is-normal locality"
                >
                  {{ initiatorType.value }}
                </label>
              </div>
            </div>
          </div>

          <div v-if="initiatorTypeSelected === InitiatorType.ASSOCIATION.key">
            <div class="field mb-3">
              <label class="label"
                >Quel est le nom de votre association ?</label
              >
              <div class="control">
                <input
                  v-model="associationName"
                  class="input is-normal-width"
                  type="text"
                  placeholder="Démocratie Ouverte"
                />
              </div>
            </div>
          </div>

          <div class="field mb-3">
            <label class="label">{{
              pageStore.evaluationInitPage.publicNameQuestion
            }}</label>
            <span class="is-family-secondary is-size-6">{{
              pageStore.evaluationInitPage.publicNameQuestionDescription
            }}</span>
            <div class="buttons mt-1">
              <div
                v-for="(consentPublicName, index) of [true, false]"
                :key="index"
                class="margin-between"
              >
                <input
                  :id="consentPublicName"
                  v-model="consentPublicNameSelected"
                  type="radio"
                  :value="consentPublicName"
                  class="custom-hidden white-on-black-input-checked"
                  name="consentPublicName"
                  required
                />
                <label
                  :for="consentPublicName"
                  class="button is-normal locality"
                >
                  {{ consentPublicName ? "Oui" : "Non" }}
                </label>
              </div>
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
      </div>
      <!-- Representativity rates -->
      <div
        v-if="initializationSteps[currentStep] === steps.REPRESENTATIVITY"
        class="column is-8"
      >
        <h1 class="title is-3 has-text-black-ter">
          {{ pageStore.evaluationInitPage.representativityQuestion }}
        </h1>
        <RichText
          class="is-family-secondary mb-2"
          :rich-text="pageStore.evaluationInitPage.representativityDescription"
        ></RichText>
        <form @submit.prevent="onSubmit">
          <div
            v-for="representativityCriteria of assessmentStore.representativityCriterias"
            :key="representativityCriteria.id"
          >
            <label class="label">{{ representativityCriteria.name }}</label>
            <span class="is-family-secondary is-size-6">
              Les réponses possibles sont :
              <span
                v-for="responseChoice of representativityCriteria.responseChoiceStatements"
                :key="responseChoice"
              >
                {{ responseChoice }},
              </span>
              <br />
              L'équilibre parfait serait:
              {{
                (
                  100 / representativityCriteria.responseChoiceStatements.length
                ).toFixed(2)
              }}
              %
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
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { usePageStore } from "~/stores/pageStore"
import { InitiatorType } from "~/composables/types"
import { useAssessmentStore } from "~~/stores/assessmentStore"

definePageMeta({
  title: "Initialisation",
  breadcrumb: "Initialisation",
  middleware: ["assessment"],
})

const pageStore = usePageStore()
if (!pageStore.evaluationInitPage.title) {
  pageStore.loadEvaluationInitPage()
}

const assessmentStore = useAssessmentStore()
if (assessmentStore.representativityCriterias.length === 0) {
  assessmentStore.getRepresentativityCriterias()
}

const color = ref("no-pillar")

enum steps {
  START = "start",
  INITIATOR = "initiator",
  REPRESENTATIVITY = "representativity",
}
const initializationSteps = [
  steps.START,
  steps.INITIATOR,
  steps.REPRESENTATIVITY,
]
const currentStep = ref<number>(0)

const initiatorTypeSelected = ref<string>()
const consentPublicNameSelected = ref<boolean>()
const associationName = ref<string>()

const disabled = computed(() => {
  if (initializationSteps[currentStep.value] === steps.INITIATOR) {
    return initiatorTypeSelected.value &&
      consentPublicNameSelected.value !== undefined &&
      (initiatorTypeSelected.value === InitiatorType.ASSOCIATION.key
        ? associationName.value
        : true)
      ? false
      : true
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
    currentStep.value += 1
  } else {
    onSubmit()
  }
}

async function onSubmit() {
  // TODO --> page de validation
  assessmentStore.initializeAssessment({
    initiatorType: initiatorTypeSelected.value,
    consent: consentPublicNameSelected.value,
    initiatorName: associationName.value,
  })
}
</script>
