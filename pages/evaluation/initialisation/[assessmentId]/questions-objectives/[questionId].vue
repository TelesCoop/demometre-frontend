<template>
  <div class="container is-tight">
    <Question
      v-if="context"
      :context="context"
      :question-id="questionId"
      :is-questionnaire="false"
      :color="color"
    />
  </div>
</template>

<script setup lang="ts">
import { useInitializationJourney } from "~/composables/journey"
import { useParticipationStore } from "~/stores/participationStore"
import { QuestionContextProps, PillarParams } from "~/composables/types"
import { Ref, ref } from "vue"
import { useQuestionnaireStore } from "~/stores/questionnaireStore"

definePageMeta({
  title: "Questions objectives",
  step: "initialization-objectives-questions",
})

const route = useRoute()
const router = useRouter()
const questionnaireStore = useQuestionnaireStore()
const participationStore = useParticipationStore()

console.log("### questionId setup 0")
const journey = useInitializationJourney()
console.log("### questionId setup 0.5", { journey })
const questionId: Ref<number> = ref(+route.params.questionId)
console.log("### questionId setup", { questionId: questionId.value })
let pillarName = questionnaireStore.questionById[questionId.value].pillarName
console.log("### questionId setup 1.01")
const color = computed<string>(() => PillarParams[pillarName].color)

router.beforeEach((to) => {
  if (+to.params.questionId) {
    questionId.value = +to.params.questionId
    pillarName = questionnaireStore.questionById[questionId.value]?.pillarName
  }
})
console.log("### questionId setup 1.1")
console.log("### questionId setup 2", { journey })
const context: QuestionContextProps = {
  journey,
  questionById: questionnaireStore.questionById,
  responseByQuestionId: participationStore.responseByQuestionnaireQuestionId,
  hasPreviousStep: true,
}
console.log("### questionId setup 3")
</script>
