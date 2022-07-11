import { useProfilingStore } from "~/stores/profilingStore"
import { useQuestionnaireStore } from "~/stores/questionnaireStore"
import { useAssessmentStore } from "~~/stores/assessmentStore"
import { useDefinitionStore } from "~~/stores/definitionStore"
import { useSettingStore } from "~~/stores/settingStore"
import { useUserStore } from "~/stores/userStore"
import { useParticipationStore } from "~/stores/participationStore"

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("vue:setup", () => {
    const userStore = useUserStore()
    const participationStore = useParticipationStore()
    const assessmentStore = useAssessmentStore()
    const profilingStore = useProfilingStore()
    const questionnaireStore = useQuestionnaireStore()
    const definitionStore = useDefinitionStore()
    const settingStore = useSettingStore()
    userStore.refreshProfile(false)
    participationStore.getCurrentParticipation()
    assessmentStore.getCurrentAssessment()
    participationStore.getCurrentProfilingQuestionResponses()
    participationStore.getCurrentQuestionnaireQuestionResponses()
    profilingStore.getProfilingQuestions()
    questionnaireStore.getQuestionnaireQuestions()
    questionnaireStore.getQuestionnaireStructure()
    assessmentStore.getRepresentativityCriterias()
    definitionStore.getDefinitions()
    settingStore.getRgpdSettings()
  })
})
