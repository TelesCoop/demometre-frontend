import { useAssessmentStore } from "~~/stores/assessmentStore"

async function verifyAssessment(to) {
  const assessmentStore = useAssessmentStore()

  // Load data if f5
  if (process.server) {
    await useAssessmentStore().getAssessment(
      to.params.assessmentId || to.query.assessment
    )
  }
  if (
    !assessmentStore.currentAssessment?.initializationDate &&
    to.path !== "/evaluation/initialization"
  ) {
    useRouter().push(
      `/evaluation/initialization?assessment=${assessmentStore.currentAssessmentId}`
    )
  }
}

export default defineNuxtRouteMiddleware(verifyAssessment)
