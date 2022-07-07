<template>
  <div>
    <div class="container">
      <section class="columns section">
        <div class="column is-7">
          <PageTitle
            :title="pageStore.resultsPage.title"
            :subtitle="pageStore.resultsPage.tagLine"
          />
          <RichText
            :rich-text="pageStore.referentialPage.description"
            class="is-family-secondary"
          />
        </div>
        <div class="column is-5 is-hidden-mobile" style="text-align: end">
          <figure class="image">
            <img
              :src="MADIA_BASE_URL + pageStore.resultsPage.introImageUrl"
              alt
            />
          </figure>
        </div>
      </section>
    </div>

    <div class="container mobile-mode">
      <section class="columns is-multiline mt-4">
        <div
          v-for="pillar of questionnaireStore.pillars"
          :key="pillar.name"
          class="column"
        >
          <QuestionnairePillar
            :name="pillar.name"
            :active="pillar.name === activePillar?.name"
            class="is-clickable"
            @click="onSelectPillar(pillar)"
          />
        </div>
      </section>
      <section v-if="activePillar">
        <QuestionnairePillarReferential
          :pillar="activePillar"
          :color="colorClass"
          :markers="markers"
          :initial-question-id="activeQuestionId"
        />
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router"
import { ref } from "vue"
import { useQuestionnaireStore } from "~/stores/questionnaireStore"
import { usePageStore } from "~/stores/pageStore"
import { Marker, PillarType } from "~/composables/types"
import { MADIA_BASE_URL } from "~/composables/api"

definePageMeta({
  title: "Résultats",
  breadcrumb: "Résultats",
})

const router = useRouter()

const questionnaireStore = useQuestionnaireStore()
const pageStore = usePageStore()

if (!pageStore.resultsPage.title) {
  pageStore.getResultsPage()
}

const activePillar = ref<PillarType>()
const markers = ref<Marker[]>()

const route = useRoute()
const activeQuestionId = computed<number>(() => {
  return parseInt(route.query.question as string)
})

watch(activeQuestionId, () => {
  const pillar =
    questionnaireStore.pillarByName[
      questionnaireStore.questionById[activeQuestionId.value].pillarName
    ]
  onSelectPillar(pillar)
})

const colorClass = computed(() =>
  activePillar.value ? PillarParams[activePillar.value.name].color : ""
)

const onSelectPillar = (pillar) => {
  activePillar.value = pillar
  markers.value = activePillar.value?.markerIds.map(
    (markerId) => questionnaireStore.markerById[markerId]
  )
  router.push({ query: { ...route.query, pillar: pillar.name } })
}

if (activeQuestionId.value) {
  const pillar =
    questionnaireStore.pillarByName[
      questionnaireStore.questionById[activeQuestionId.value]?.pillarName
    ]
  onSelectPillar(pillar)
}
</script>

<style scoped lang="sass">
.buttons .button
  height: fit-content
img
  width: 100%
  object-fit: cover
@include touch
  .rosette-menu
    display: none
</style>
