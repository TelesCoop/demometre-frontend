<template>
  <NeedsParticipationOrAssessment class="container is-tight">
    <Question
      v-if="context"
      :context="context"
      :question-id="questionId"
      :is-questionnaire="false"
      color="no-pillar"
    />
  </NeedsParticipationOrAssessment>
</template>

<script setup lang="ts">
import { useProfilingJourney } from "~/composables/journey"
import { useProfilingStore } from "~/stores/profilingStore"
import { useParticipationStore } from "~/stores/participationStore"
import { QuestionContextProps } from "~/composables/types"
import { ref } from "vue"

definePageMeta({
  // title: $t("Affinage"),
  step: "profiling",
})

const route = useRoute()
const router = useRouter()

const questionId = ref(+route.params.questionId)

router.beforeEach((to) => {
  if (+to.params.questionId && route.path.includes("evaluation") && route.path.includes("affinage")) {
    questionId.value = +to.params.questionId
  }
})

const profilingStore = useProfilingStore()
const participationStore = useParticipationStore()
const journey = useProfilingJourney()
const context: QuestionContextProps = {
  journey,
  questionById: profilingStore.questionById,
  responseByQuestionId: participationStore.responseByProfilingQuestionId,
  hasPreviousStep: false,
}
</script>

<style scoped lang="sass"></style>
