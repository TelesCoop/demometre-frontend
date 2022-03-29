import { useAssessmentStore } from "~~/stores/assessmentStore"

export default defineNuxtRouteMiddleware(async (to) => {
  const assessmentStore = useAssessmentStore()

  // Load data if f5
  if (process.server) {
    await useAssessmentStore().getAssessment(to.params.assessmentId)
  }
  if (!assessmentStore.currentAssessment?.initializationDate) {
    useRouter().push("/evaluation/initier")
  }
})
