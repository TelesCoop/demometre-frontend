import { useProfilingStore } from "~/stores/profilingStore"
import { useQuestionnaireStore } from "~/stores/questionnaireStore"
import { useAssessmentStore } from "~~/stores/assessmentStore"
import { useDefinitionStore } from "~~/stores/definitionStore"

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("vue:setup", () => {
    const profilingStore = useProfilingStore()
    const questionnaireStore = useQuestionnaireStore()
    const assessmentStore = useAssessmentStore()
    const definitionStore = useDefinitionStore()
    profilingStore.getProfilingQuestions()
    questionnaireStore.getQuestionnaireQuestions()
    questionnaireStore.getQuestionnaireStructure()
    assessmentStore.getRepresentativityCriterias()
    definitionStore.getDefinitions()
  })
})
