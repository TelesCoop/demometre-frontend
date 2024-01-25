import { useAssessmentStore } from "~/stores/assessmentStore"

async function verifyAssessment(to) {
  const assessmentStore = useAssessmentStore()

  // Load data if f5
  if (process.server) {
    await assessmentStore.getAssessment(
      to.params.assessmentId || to.query.assessment
    )
  }
  if (
    !assessmentStore.currentAssessment?.initializationDate &&
    to.path !== "/evaluation/initialisation"
  ) {
    console.log("### verifyAssessment navigation add assessment")
    navigateTo(
      `/evaluation/initialisation?assessment=${assessmentStore.currentAssessmentId}`
    )
  }
}

export default defineNuxtRouteMiddleware(verifyAssessment)
