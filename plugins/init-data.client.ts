import { useQuestionnaireStore } from "~/stores/questionnaireStore"
import { useProfilingStore } from "~/stores/profilingStore"
import { useAssessmentStore } from "~~/stores/assessmentStore"
import { useDefinitionStore } from "~~/stores/definitionStore"
import { useSettingStore } from "~~/stores/settingStore"
import { useUserStore } from "~/stores/userStore"
import { useParticipationStore } from "~/stores/participationStore"

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("app:mounted", () => {
    // the data should already be fetched from SSR
    // but if it's missing, we try again from the client

    const userStore = useUserStore()
    const participationStore = useParticipationStore()
    const assessmentStore = useAssessmentStore()
    const profilingStore = useProfilingStore()
    const questionnaireStore = useQuestionnaireStore()
    const definitionStore = useDefinitionStore()
    const settingStore = useSettingStore()

    if (!userStore.user) {
      userStore.refreshProfile(false)
    }

    if (!participationStore.participation) {
      participationStore.getCurrentParticipation()
    }

    if (!assessmentStore.currentAssessment) {
      assessmentStore.getCurrentAssessment()
    }

    if (!assessmentStore.currentAssessment) {
      participationStore.getCurrentParticipation()
    }

    if (
      Object.keys(participationStore.responseByProfilingQuestionId).length === 0
    ) {
      participationStore.getCurrentProfilingQuestionResponses()
    }

    if (
      Object.keys(participationStore.responseByQuestionnaireQuestionId)
        .length === 0
    ) {
      participationStore.getCurrentQuestionnaireQuestionResponses()
    }

    if (!profilingStore.orderedQuestionId.length) {
      profilingStore.getProfilingQuestions()
    }
    if (!questionnaireStore.pillars.length) {
      questionnaireStore.getQuestionnaireStructure()
    }
    if (!questionnaireStore.questions.length) {
      questionnaireStore.getQuestionnaireQuestions()
    }
    if (!assessmentStore.representativityCriterias.length) {
      assessmentStore.getRepresentativityCriterias()
    }
    if (!definitionStore.definitionLoaded) {
      definitionStore.getDefinitions()
    }
    if (!settingStore.rgpdSettingsLoaded) {
      settingStore.getRgpdSettings()
    }
    if (!settingStore.structureSettings.email) {
      settingStore.getStructureSettings()
    }
  })
})
