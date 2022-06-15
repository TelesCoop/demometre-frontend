<template>
  <div class="container">
    <section class="columns section">
      <div class="column is-5">
        <PageTitle
          v-if="pillarsCompleted.length === 0"
          :title="pageStore.evaluationQuestionnairePage.startTitle"
          :subtitle="pageStore.evaluationQuestionnairePage.startText"
        />
        <PageTitle
          v-else-if="pillarsCompleted.length === 4"
          :title="pageStore.evaluationQuestionnairePage.finishedTitle"
          :subtitle="
            userStore.isLoggedIn
              ? pageStore.evaluationQuestionnairePage.finishedTextLoggedIn
              : pageStore.evaluationQuestionnairePage.finishedTextLoggedOut
          "
        />
        <PageTitle
          v-else
          :title="intermediateStepTitle"
          :subtitle="
            userStore.isLoggedIn
              ? pageStore.evaluationQuestionnairePage
                  .intermediateStepTextLoggedIn
              : pageStore.evaluationQuestionnairePage
                  .intermediateStepTextLoggedOut
          "
        />
        <nuxt-link
          v-if="pillarsCompleted.length === 4"
          class="button is-normal is-rounded is-outlined is-responsive is-shade-600"
          to="/resultats"
        >
          <span>Voir les résultats</span>
          <span class="icon">
            <icon size="20" name="bar-chart-box-line" />
          </span>
        </nuxt-link>
      </div>
      <div class="column is-6 is-offset-1">
        <Rosette
          center-button-name="Commencer"
          :pillars-completed="pillarsCompleted"
          @center-button-click="onStartQuestionnaire"
          @pillar-click="onRosettePillarClicked($event)"
          @marker-click="onRosetteMarkerClicked($event)"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useQuestionnaireJourney } from "~/composables/journey"
import { useQuestionnaireStore } from "~/stores/questionnaireStore"
import { usePageStore } from "~/stores/pageStore"
import { useParticipationStore } from "~/stores/participationStore"
import { useUserStore } from "~/stores/userStore"

definePageMeta({
  title: "Questionnaire",
  step: "questionnaire",
  middleware: ["user-step"],
})

const questionnaireStore = useQuestionnaireStore()
const participationStore = useParticipationStore()
const pageStore = usePageStore()
const userStore = useUserStore()

if (
  Object.keys(participationStore.totalAndAnsweredQuestionsByPillarName)
    .length !== 4
) {
  participationStore.setTotalAndAnsweredQuestionsByPillarName()
}

if (!pageStore.evaluationQuestionnairePage.startTitle) {
  pageStore.getEvaluationQuestionnairePage()
}

const pillarsCompleted = computed(() =>
  Object.keys(participationStore.totalAndAnsweredQuestionsByPillarName).filter(
    (pillarName) =>
      participationStore.totalAndAnsweredQuestionsByPillarName[pillarName]
        .completed
  )
)

const intermediateStepTitle = computed(() => {
  const pillarNames = pageStore.evaluationQuestionnairePage
    .isIntermediateStepTitleWithPillarNames
    ? pillarsCompleted.value.join(", ")
    : ""
  return `${pageStore.evaluationQuestionnairePage.intermediateStepTitle} ${pillarNames}.`
})

const startPillar = (pillarName) => {
  useQuestionnaireJourney(pillarName).goToNextQuestion(undefined)
}

const onStartQuestionnaire = () => {
  const pillarName = Object.keys(questionnaireStore.pillarByName).find(
    (name) => !pillarsCompleted.value.includes(name)
  )
  startPillar(pillarName)
}
const onRosettePillarClicked = (pillarName) => {
  startPillar(pillarName)
}
const onRosetteMarkerClicked = (markerId) => {
  onRosettePillarClicked(questionnaireStore.markerById[markerId].pillarName)
}
</script>

<style scoped lang="sass">
.buttons .button
  height: fit-content
</style>
