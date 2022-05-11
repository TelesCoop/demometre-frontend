<template>
  <div class="container is-tight pillar-try">
    <Question
      v-if="context"
      :context="context"
      :question-id="questionId"
      color="no-pillar"
    />
  </div>
</template>

<script setup lang="ts">
import {
  useProfilingJourney,
  useQuestionnaireJourney,
} from "~/composables/journey"
import { useParticipationStore } from "~/stores/participationStore"
import { QuestionContextProps } from "~/composables/types"
import { Ref, ref } from "@vue/reactivity"
import { useQuestionnaireStore } from "~/stores/questionnaireStore"

definePageMeta({
  title: "Affinage",
  step: "profiling",
  middleware: ["user-step"],
})

const route = useRoute()
const router = useRouter()
const questionnaireStore = useQuestionnaireStore()

const questionId: Ref<number> = ref(+route.params.questionId)

let pillarId = questionnaireStore.getHierarchicalQuestionStructure({
  questionId: questionId.value,
}).pillarId
let journey = useQuestionnaireJourney(pillarId)
let questionById =
  questionnaireStore.getQuestionnaireQuestionByPillarId(pillarId)

router.beforeEach((to) => {
  questionId.value = +to.params.questionId
  pillarId = questionnaireStore.getHierarchicalQuestionStructure({
    questionId: questionId.value,
  }).pillarId
  journey = useQuestionnaireJourney(pillarId)
  questionById = questionnaireStore.getQuestionnaireQuestionByPillarId(pillarId)
})

const participationStore = useParticipationStore()
const context: QuestionContextProps = {
  journey,
  questionById,
  responseByQuestionId: participationStore.responseByQuestionnaireQuestionId,
}
</script>

<style scoped lang="sass"></style>
