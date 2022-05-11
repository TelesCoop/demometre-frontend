import { useQuestionnaireStore } from "~/stores/questionnaireStore"

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("vue:setup", () => {
    const questionnaireStore = useQuestionnaireStore()
    questionnaireStore.getQuestionnaireStructure()
    questionnaireStore.getQuestionnaireQuestions()
  })
})
