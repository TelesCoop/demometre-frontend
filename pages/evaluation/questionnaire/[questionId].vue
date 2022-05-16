<template>
  <div class="container is-tight">
    <Question
      v-if="context"
      :context="context"
      :question-id="questionId"
      :color="color"
    />
  </div>
</template>

<script setup lang="ts">
import { useQuestionnaireJourney } from "~/composables/journey"
import { useParticipationStore } from "~/stores/participationStore"
import { QuestionContextProps, PillarParams } from "~/composables/types"
import { Ref, ref } from "@vue/reactivity"
import { useQuestionnaireStore } from "~/stores/questionnaireStore"

definePageMeta({
  title: "Questionnaire",
  step: "questionnaire",
  middleware: ["user-step"],
})

const route = useRoute()
const router = useRouter()
const questionnaireStore = useQuestionnaireStore()

const questionId: Ref<number> = ref(+route.params.questionId)
let { pillarId, pillarName } =
  questionnaireStore.getHierarchicalQuestionStructure({
    questionId: questionId.value,
  })
let journey = useQuestionnaireJourney(pillarId)
const color = computed<string>(() =>
  pillarName ? PillarParams[pillarName].color : "no-pillar"
)

router.beforeEach((to) => {
  if (to.params.questionId) {
    questionId.value = +to.params.questionId
    pillarId = questionnaireStore.getHierarchicalQuestionStructure({
      questionId: questionId.value,
    }).pillarId
    journey = useQuestionnaireJourney(pillarId)
  }
})

const participationStore = useParticipationStore()
const context: QuestionContextProps = {
  journey,
  questionById: questionnaireStore.questionById,
  responseByQuestionId: participationStore.responseByQuestionnaireQuestionId,
}
</script>

<style scoped lang="sass"></style>
