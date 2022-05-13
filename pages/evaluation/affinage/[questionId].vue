<template>
  <div class="container is-tight">
    <Question
      v-if="context"
      :context="context"
      :question-id="questionId"
      color="no-pillar"
    />
  </div>
</template>

<script setup lang="ts">
import { useProfilingJourney } from "~/composables/journey"
import { useProfilingStore } from "~/stores/profilingStore"
import { useParticipationStore } from "~/stores/participationStore"
import { QuestionContextProps } from "~/composables/types"
import { ref } from "@vue/reactivity"

definePageMeta({
  title: "Affinage",
  step: "profiling",
  middleware: ["user-step"],
})

const route = useRoute()
const router = useRouter()

const questionId = ref(+route.params.questionId)

router.beforeEach((to) => {
  questionId.value = +to.params.questionId
})

const profilingStore = useProfilingStore()
const participationStore = useParticipationStore()
const context: QuestionContextProps = {
  journey: useProfilingJourney(),
  questionById: profilingStore.questionById,
  responseByQuestionId: participationStore.responseByProfilingQuestionId,
}
</script>

<style scoped lang="sass"></style>
