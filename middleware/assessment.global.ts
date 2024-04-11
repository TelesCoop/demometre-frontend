import { useAssessmentStore } from "~/stores/assessmentStore"
import { useParticipationStore } from "~/stores/participationStore"

async function verifyAssessment(to) {
  const assessmentStore = useAssessmentStore()
  const participationStore = useParticipationStore()
  const assessmentId = to.params.assessmentId || to.query.assessment
  if (assessmentId) {
    assessmentStore.currentAssessmentId = parseInt(assessmentId)
    console.log("### set assessment from query", assessmentStore.currentAssessmentId)
    if (!assessmentStore.currentAssessment) {
      console.log("### no current assessment, fetch it get assessment from query")
      await assessmentStore.getAssessment(assessmentId)
    }
    if (!participationStore.currentParticipationId || participationStore.currentParticipationId === -1) {
      console.log("### set participation from assessment and load assessment responses")
      await Promise.all([
        participationStore.getParticipationForAssessmentOnce(assessmentId),
        participationStore.loadAssessmentOnce(assessmentId),
      ])
    }
  }
}

export default defineNuxtRouteMiddleware(verifyAssessment)
