<template>
  <div class="container is-tight">
    <h1 class="title is-3 mt-2">
      {{ pageStore.evaluationQuestionnairePage.roleQuestionTitle }}
    </h1>
    <p class="is-family-secondary">
      {{ pageStore.evaluationQuestionnairePage.roleQuestionDescription }}
    </p>
    <form @submit.prevent="onSubmit">
      <div class="my-1_5">
        <ResponseInputUniqueChoice
          v-model="answer"
          :response-choices="responseChoices"
          :color="color"
          question-id="role"
          :white-letter-when-select="true"
        />
      </div>
      <div class="buttons mt-1_5">
        <button class="button is-normal is-rounded" :disabled="disabled">
          <span>Valider</span>
          <span class="icon">
            <icon v-if="isLoading" size="24" name="loader-2-line" />
            <icon v-else size="24" name="check" />
          </span>
        </button>
        <span v-if="isLoading" class="is-size-7 has-text-shade-600"
          >en cours de chargement</span
        >

        <!-- Permet d'appuyer sur entrer -->
        <input type="submit" hidden />
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "@vue/reactivity"
import { useProfilingStore } from "~/stores/profilingStore"
import { useParticipationStore } from "~/stores/participationStore"
import { getDataOfParticipation } from "~/composables/actions"
import { useProfilingJourney } from "~/composables/journey"
import { usePageStore } from "~/stores/pageStore"

definePageMeta({
  title: "Question sur le role",
  step: "role",
  middleware: ["assessment", "user-step"],
})

const participationStore = useParticipationStore()
const pageStore = usePageStore()
if (!pageStore.evaluationQuestionnairePage.startTitle) {
  pageStore.getEvaluationQuestionnairePage()
}

const color = ref("no-pillar")
const answer = ref(participationStore.participation.roleId)
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

async function onSubmit() {
  isLoading.value = true
  participationStore.chooseRole(answer.value)
  const isSuccess = await participationStore.createParticipation()
  if (isSuccess) {
    await getDataOfParticipation()
    useProfilingJourney().goToNextQuestion(undefined)
  }
}
</script>
