<template>
  <div class="container is-tight">
    <h1 class="title is-3 mt-2 has-text-black">
      {{ pageStore.evaluationQuestionnairePage.roleQuestionTitle }}
    </h1>
    <RichText
      v-if="pageStore.evaluationQuestionnairePage.roleQuestionDescription"
      class="is-family-secondary"
      :rich-text="pageStore.evaluationQuestionnairePage.roleQuestionDescription"
    ></RichText>
    <form class="questionnaire-container mb-4" @submit.prevent="onSubmit">
      <div class="my-1_5 nav-questionnaire-container">
        <ResponseInputUniqueChoice
          v-model="answer"
          :response-choices="responseChoices"
          :color="color"
          question-id="role"
          :white-letter-when-select="true"
        />

        <ButtonsArrowButton
          color="no-pillar"
          class="arrow-button-fixed is-left"
          @click.prevent="goBack"
        />
      </div>
      <div class="buttons mt-1_5">
        <button
          class="button is-shade-600 is-rounded"
          type="submit"
          :disabled="disabled"
        >
          <span>Valider</span>
          <span class="icon">
            <icon v-if="isLoading" size="24" name="loader-2-line" />
            <icon v-else size="20" name="check" />
          </span>
        </button>
        <span v-if="isLoading" class="is-size-7 has-text-shade-600"
          >en cours de chargement</span
        >
        <span
          v-else-if="!disabled"
          class="is-size-7 has-text-shade-600 is-hidden-mobile"
        >
          appuyez sur
          <span class="has-text-weight-bold">Entrer ⏎</span>
        </span>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "@vue/reactivity"
import { useProfilingStore } from "~/stores/profilingStore"
import { useParticipationStore } from "~/stores/participationStore"
import { useProfilingJourney } from "~/composables/journey"
import { usePageStore } from "~/stores/pageStore"
import { useAssessmentStore } from "~/stores/assessmentStore"
import { usePressEnter } from "~/composables/pressEnter"

definePageMeta({
  title: "Question sur le role",
  step: "role",
  middleware: ["assessment", "user-step"],
})

const router = useRouter()
const participationStore = useParticipationStore()
const assessmentStore = useAssessmentStore()
const pageStore = usePageStore()
if (!pageStore.evaluationQuestionnairePage.startTitle) {
  pageStore.getEvaluationQuestionnairePage()
}

const color = ref("no-pillar")
const answer = ref(participationStore.newParticipation.roleId)
const isLoading = ref(false)

const profilingStore = useProfilingStore()
if (!profilingStore.roles.length) {
  profilingStore.getRoles()
}

const responseChoices = computed(() =>
  profilingStore.roles.map((role) => {
    return {
      id: role.id,
      responseChoice: role.name,
      description: role.description,
    }
  })
)

const disabled = computed(() => {
  return !answer.value || isLoading.value
})

function goBack() {
  router.push(
    `/evaluation/participation/${assessmentStore.currentAssessmentId}/tableau-de-bord`
  )
}

async function onSubmit() {
  isLoading.value = true
  participationStore.chooseRole(answer.value)
  const isSuccess = await participationStore.createParticipation()

  if (isSuccess) {
    await participationStore.getCurrentQuestionnaireObjectiveQuestionResponses()
    useProfilingJourney().goToNextQuestion(undefined)
  }
}

usePressEnter(onSubmit, () => !disabled.value)
</script>
