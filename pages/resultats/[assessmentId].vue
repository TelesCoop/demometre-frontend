<template>
  <div>
    <div class="container">
      <PageSection :title="assessmentStore.assessmentById[assessmentId]?.name">
        <ParticipationBoard
          :assessment="assessmentStore.assessmentById[assessmentId]"
        ></ParticipationBoard>
      </PageSection>
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
        >
          <template #criteria="criteriaProps">
            <RichText
              v-if="criteriaProps.criteria.description"
              :rich-text="criteriaProps.criteria.description"
              class="is-family-secondary subtitle mb-2"
            />
            <QuestionnaireQuestionStatement
              v-for="questionId of criteriaProps.criteria.questionIds"
              :key="questionId"
              :color="colorClass"
              :question="questionnaireStore.questionById[questionId]"
              class="mb-2"
            >
              <!-- TODO : Results graphs -->
            </QuestionnaireQuestionStatement>
          </template>
          <template #marker="markerProps">
            <RichText
              v-if="markerProps.marker.description"
              :rich-text="markerProps.marker.description"
              class="is-family-secondary subtitle mb-2"
            />
            <ResultPlusAndMinus
              :strengths-and-improvements="
                getMarkerStrenghtAndImprovements(
                  markerProps.marker,
                  assessmentStore.scoresByAssessmentId[assessmentId]
                )
              "
            />
          </template>
          <template #pillar="pillarProps">
            <!-- TODO: plus and minus points -->
            <p>{{ pillarProps.pillar.name }}</p>
            <ResultPlusAndMinus :strengths-and-improvements="{}" />
          </template>
        </QuestionnairePillarReferential>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router"
import { Ref, ref } from "@vue/reactivity"
import { useQuestionnaireStore } from "~/stores/questionnaireStore"
import { Marker, PillarType } from "~/composables/types"
import { useAssessmentStore } from "~/stores/assessmentStore"
import { getMarkerStrenghtAndImprovements } from "~/utils/strenghtAndImprovement"

definePageMeta({
  title: "Résultats",
  breadcrumb: "Résultats",
})

const router = useRouter()

const questionnaireStore = useQuestionnaireStore()
const assessmentStore = useAssessmentStore()

const activePillar = ref<PillarType>()
const markers = ref<Marker[]>()

const route = useRoute()
const assessmentId: Ref<number> = ref(+route.params.assessmentId)
const activeQuestionId = computed<number>(() => {
  return parseInt(route.query.question as string)
})

if (!assessmentStore.assessmentById[assessmentId.value]?.name) {
  assessmentStore.getAssessment(assessmentId.value)
}
if (!assessmentStore.scoresByAssessmentId[assessmentId.value]?.byQuestionId) {
  assessmentStore.getAssessmentScores(assessmentId.value)
}

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

<style scoped lang="sass"></style>
