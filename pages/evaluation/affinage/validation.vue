<template>
  <div class="container">
    <section class="section columns is-centered questionnaire-container">
      <div class="column is-8 nav-questionnaire-container">
        <h1 class="title is-3 has-text-black-ter">
          {{ pageStore.evaluationQuestionnairePage.endOfProfilingTitle }}
        </h1>
        <RichText
          :rich-text="
            pageStore.evaluationQuestionnairePage.endOfProfilingDescription
          "
          class="is-family-secondary"
        />

        <QuestionnairePreviousButton color="no-pillar" @go-back="goBack" />

        <button
          class="button is-shade-600 is-rounded mt-4"
          @click.prevent="submit"
        >
          <span>Valider</span>
          <span class="icon">
            <icon size="16" name="check" />
          </span>
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { usePageStore } from "~/stores/pageStore"
import { useParticipationStore } from "~/stores/participationStore"

definePageMeta({
  title: "Affinage",
  step: "profiling",
  middleware: ["user-step"],
})

const router = useRouter()
const participationStore = useParticipationStore()
const pageStore = usePageStore()
if (!pageStore.evaluationQuestionnairePage.endOfProfilingTitle) {
  pageStore.getEvaluationQuestionnairePage()
}

function goBack() {
  router.go(-1)
}

async function submit() {
  await participationStore.saveEndQuestionnaire(true)
  useRouter().push("/evaluation/questionnaire")
}
</script>
