import { useAssessmentStore } from "~~/stores/assessmentStore"

async function verifyAssessment(to) {
  const assessmentStore = useAssessmentStore()

  // Load data if f5
  if (process.server) {
    assessmentStore.getAssessment(to.params.assessmentId)
  }
  if (!assessmentStore.currentAssessment?.initializationDate) {
    useRouter().push("/evaluation/initier")
  }
}

export default defineNuxtRouteMiddleware(verifyAssessment)
