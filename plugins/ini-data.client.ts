import { useQuestionnaireStore } from "~/stores/questionnaireStore"
import { useProfilingStore } from "~/stores/profilingStore"

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("app:mounted", () => {
    // the data should already be fetched from SSR
    // but if it's missing, we try again from the client

    const profilingStore = useProfilingStore()
    const questionnaireStore = useQuestionnaireStore()

    if (!profilingStore.orderedQuestionId.length) {
      profilingStore.getProfilingQuestions()
    }

    if (!questionnaireStore.pillars.length) {
      questionnaireStore.getQuestionnaireStructure()
    }
    if (!questionnaireStore.questions.length) {
      questionnaireStore.getQuestionnaireQuestions()
    }
  })
})
