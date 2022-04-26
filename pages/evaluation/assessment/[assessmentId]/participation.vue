<template>
  <div class="container is-tight">
    <h1 class="title is-3 mt-2">Etes-vous actuellement...</h1>
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
            <icon size="24" name="check" />
          </span>
        </button>

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

definePageMeta({
  title: "Question sur le role",
  middleware: ["assessment"],
})

const color = ref("no-pillar")
const answer = ref()

const profilingStore = useProfilingStore()
if (!profilingStore.roles.length) {
  profilingStore.loadRoles()
}

const participationStore = useParticipationStore()

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
  return !answer.value
})

async function onSubmit() {
  participationStore.chooseRole(answer.value)
  // TODO : if participaton exist, update it
  const isSuccess = await participationStore.createParticipation()
  if (isSuccess) {
    await getDataOfParticipation()
    useProfilingJourney().goToNextQuestion(undefined)
  } else {
    // TODO : manage case when there is not next profiling Question
  }
}
</script>

<style scoped lang="sass">
input:checked + label
  background-color: $black
  color: $white
.buttons .locality-container:not(:last-child):not(.is-fullwidth)
  margin-right: 0.5rem
</style>
