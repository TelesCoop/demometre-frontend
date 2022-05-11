import { useQuestionnaireStore } from "~/stores/questionnaireStore"

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("app:mounted", () => {
    // the data should already be fetched from SSR
    // but if it's missing, we try again from the client

    const questionnaireStore = useQuestionnaireStore()
    if (!questionnaireStore.pillars.length) {
      questionnaireStore.getQuestionnaireStructure()
    }
    if (!questionnaireStore.questions.length) {
      questionnaireStore.getQuestionnaireQuestions()
    }
  })
})
