import { useAssessmentStore } from "~/stores/assessmentStore"

async function verifyAssessment(to) {
  const assessmentStore = useAssessmentStore()
  const assessmentId = to.params.assessmentId || to.query.assessment
  if (assessmentId) {
    assessmentStore.currentAssessmentId = parseInt(assessmentId)
    console.log("### set assessment from query", assessmentStore.currentAssessmentId)
    if (!assessmentStore.currentAssessment) {
      await assessmentStore.getAssessment(assessmentId)
    }
  }

  // Load data if f5
  if (process.server) {
    await assessmentStore.getAssessment(assessmentId)
  }
  // if (
  //   !assessmentStore.currentAssessment?.initializationDate &&
  //   to.path !== "/evaluation/initialisation"
  // ) {
  //   console.log("### verifyAssessment navigation add assessment")
  //   navigateTo(
  //     `/evaluation/initialisation?assessment=${assessmentStore.currentAssessmentId}`
  //   )
  // }
}

export default defineNuxtRouteMiddleware(verifyAssessment)
