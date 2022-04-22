import { useAssessmentStore } from "~~/stores/assessmentStore"

async function verifyAssessment(to) {
  const assessmentStore = useAssessmentStore()

  // Load data if f5
  if (process.server) {
    console.log(to.params.assessmentId || to.query.assessment)
    await useAssessmentStore().getAssessment(to.params.assessmentId || to.query.assessment)
  }
  if (!assessmentStore.currentAssessment?.initializationDate && to.path !== "/evaluation/initialization") {
    useRouter().push(`/evaluation/initialization?assessment=${assessmentStore.currentAssessment}`)
  }
}

export default defineNuxtRouteMiddleware(verifyAssessment)
