import { useProfilingStore } from "~/stores/profilingStore"
import { useQuestionnaireStore } from "~/stores/questionnaireStore"
import { useAssessmentStore } from "~~/stores/assessmentStore"

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("vue:setup", () => {
    const profilingStore = useProfilingStore()
    const questionnaireStore = useQuestionnaireStore()
    const assessmentStore = useAssessmentStore()
    profilingStore.getProfilingQuestions()
    questionnaireStore.getQuestionnaireQuestions()
    questionnaireStore.getQuestionnaireStructure()
    assessmentStore.getRepresentativityCriterias()
  })
})
