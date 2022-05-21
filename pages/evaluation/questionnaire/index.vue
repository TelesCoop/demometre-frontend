<template>
  <div class="container">
    <section class="columns section">
      <div class="column is-5">
        <PageIntro
          title="Par quel pilier ou marqueur voulez-vous commencer&nbsp;?"
          introduction="Vous pouvez choisir un marqueur ou l’un des 4 piliers ci-contre. Sinon, vous pouvez aussi vous laisser guider."
        />
      </div>
      <div class="column is-6 is-offset-1">
        <Rosette
          center-button-name="Commencer"
          @center-button-click="onStartQuestionnaire"
          @pillar-click="onRosettePillarClicked($event)"
          @marker-click="onRosetteMarkerClicked($event)"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useQuestionnaireStore } from "~/stores/questionnaireStore"
import { usePageStore } from "~/stores/pageStore"
import { useRouter } from "vue-router"
import { useUserStore } from "~/stores/userStore"

definePageMeta({
  title: "Questionnaire",
  step: "questionnaire",
  middleware: ["user-step"],
})

const router = useRouter()

const questionnaireStore = useQuestionnaireStore()
const userStore = useUserStore()
const pageStore = usePageStore()

if (!pageStore.referentialPage.title) {
  pageStore.getReferentialPage()
}

const startPillar = (pillarName) => {
  const firstQuestion =
    questionnaireStore.getQuestionnaireQuestionByPillarName(pillarName)[0]
  return router.push({
    path: `/evaluation/questionnaire/${firstQuestion.id}`,
    query: { pillar: pillarName, anonymous: userStore.anonymous.username },
  })
}

const onStartQuestionnaire = () => {
  const pillarName = questionnaireStore.pillars[0].name
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
