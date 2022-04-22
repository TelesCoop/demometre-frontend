<template>
  <div class="container is-tight pillar-try">
    <Question
      v-if="context"
      :context="context"
      :participation-id="participationId"
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
  breadcrumb: "Affinage",
})

const route = useRoute()
const router = useRouter()

const participationId = ref(+route.params.participationId)
const questionId = ref(+route.params.questionId)

router.beforeEach((to) => {
  participationId.value = +to.params.participationId
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
