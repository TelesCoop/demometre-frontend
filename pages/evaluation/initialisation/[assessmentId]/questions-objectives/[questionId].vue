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
import { Ref, ref } from "@vue/reactivity"
import { useQuestionnaireStore } from "~/stores/questionnaireStore"

definePageMeta({
  title: "Questions objectives",
  step: "initialization-objectives-questions",
  middleware: ["assessment", "user-step"],
})

const route = useRoute()
const router = useRouter()
const questionnaireStore = useQuestionnaireStore()
const participationStore = useParticipationStore()

const questionId: Ref<number> = ref(+route.params.questionId)
let pillarName = questionnaireStore.questionById[questionId.value].pillarName
const color = computed<string>(() => PillarParams[pillarName].color)

router.beforeEach((to) => {
  if (+to.params.questionId) {
    questionId.value = +to.params.questionId
    pillarName = questionnaireStore.questionById[questionId.value]?.pillarName
  }
})

const context: QuestionContextProps = {
  journey: useInitializationJourney(),
  questionById: questionnaireStore.questionById,
  responseByQuestionId: participationStore.responseByQuestionnaireQuestionId,
  hasPreviousStep: true,
}
</script>
