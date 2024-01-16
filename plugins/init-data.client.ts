import { useQuestionnaireStore } from "~/stores/questionnaireStore"
import { useProfilingStore } from "~/stores/profilingStore"
import { useAssessmentStore } from "~~/stores/assessmentStore"
import { useDefinitionStore } from "~~/stores/definitionStore"
import { useSettingStore } from "~~/stores/settingStore"
import { useUserStore } from "~/stores/userStore"
import { usePageStore } from "~/stores/pageStore"

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("app:mounted", () => {
    // the data should already be fetched from SSR
    // but if it's missing, we try again from the client

    const userStore = useUserStore()
    const assessmentStore = useAssessmentStore()
    const profilingStore = useProfilingStore()
    const questionnaireStore = useQuestionnaireStore()
    const definitionStore = useDefinitionStore()
    const settingStore = useSettingStore()
    const pageStore = usePageStore()

    if (!userStore.user) {
      userStore.refreshProfile(false)
    }

    if (!assessmentStore.currentAssessment) {
      assessmentStore.getAssessmentsForUser()
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

    if (!pageStore.homePage.title) {
      pageStore.getHomePage()
    }
  })
})
