import { useProfilingStore } from "~/stores/profilingStore"
import { useQuestionnaireStore } from "~/stores/questionnaireStore"
import { useAssessmentStore } from "~~/stores/assessmentStore"
import { useDefinitionStore } from "~~/stores/definitionStore"
import { useSettingStore } from "~~/stores/settingStore"
import { useUserStore } from "~/stores/userStore"
import { useParticipationStore } from "~/stores/participationStore"
import { usePageStore } from "~/stores/pageStore"

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("vue:setup", () => {
    const userStore = useUserStore()
    const participationStore = useParticipationStore()
    const assessmentStore = useAssessmentStore()
    const profilingStore = useProfilingStore()
    const questionnaireStore = useQuestionnaireStore()
    const definitionStore = useDefinitionStore()
    const settingStore = useSettingStore()
    const pageStore = usePageStore()
    userStore.refreshProfile(false)
    participationStore.getCurrentParticipation()
    assessmentStore.getCurrentAssessment()
    participationStore.getCurrentProfilingQuestionResponses()
    participationStore.getCurrentQuestionnaireSubjectiveQuestionResponses()
    participationStore.getCurrentQuestionnaireObjectiveQuestionResponses()
    profilingStore.getProfilingQuestions()
    questionnaireStore.getQuestionnaireQuestions()
    questionnaireStore.getQuestionnaireStructure()
    assessmentStore.getRepresentativityCriterias()
    definitionStore.getDefinitions()
    settingStore.getRgpdSettings()
    settingStore.getStructureSettings()
    pageStore.getHomePage()
  })
})
