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
import { ref } from "vue"
import { useQuestionnaireStore } from "~/stores/questionnaireStore"
import { usePageStore } from "~/stores/pageStore"
import { Marker, PillarType } from "~/composables/types"
import { useRouter } from "vue-router"

definePageMeta({
  title: "Questionnaire",
  step: "questionnaire",
  middleware: ["user-step"],
})

const router = useRouter()

const questionnaireStore = useQuestionnaireStore()
const pageStore = usePageStore()

if (!pageStore.referentialPage.title) {
  pageStore.getReferentialPage()
}

const activePillar = ref<PillarType>()
const markers = ref<Marker[]>()

const colorClass = computed(() =>
  activePillar.value ? PillarParams[activePillar.value.name].color : ""
)

const pillarsRef = ref(null)

const onSelectPillar = (pillar) => {
  activePillar.value = pillar
  markers.value = activePillar.value?.markerIds.map(
    (markerId) => questionnaireStore.markerById[markerId]
  )
  router.push({ query: { pillar: pillar.name } })
}

const onStartQuestionnaire = () => {
  const pillarId = questionnaireStore.pillars[0].id
  const firstQuestion =
    questionnaireStore.getQuestionnaireQuestionByPillarId(pillarId)[0]
  return router.push(`/evaluation/questionnaire/${firstQuestion.id}`)
}
const onRosettePillarClicked = (pillarName) => {
  onSelectPillar(questionnaireStore.getPillarByName(pillarName))
  pillarsRef.value.scrollIntoView({ behavior: "smooth" })
}
const onRosetteMarkerClicked = (markerId) => {
  onRosettePillarClicked(questionnaireStore.markerById[markerId].pillarName)
}
</script>

<style scoped lang="sass">
.buttons .button
  height: fit-content
</style>
