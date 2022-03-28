import { useAssessmentStore } from "~~/stores/assessmentStore"

export default defineNuxtRouteMiddleware((to, from) => {
  const assessmentStore = useAssessmentStore()
  if (!assessmentStore.currentAssessment?.initializationDate) {
    useRouter().push("/evaluation/initier")
  }
})
