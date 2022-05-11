import { useProfilingStore } from "~/stores/profilingStore"
import { useQuestionnaireStore } from "~/stores/questionnaireStore"

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("vue:setup", () => {
    const profilingStore = useProfilingStore()
    const questionnaireStore = useQuestionnaireStore()
    profilingStore.getProfilingQuestions()
    questionnaireStore.getQuestionnaireQuestions()
    questionnaireStore.getQuestionnaireStructure()
  })
})
