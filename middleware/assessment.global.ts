import { useAssessmentStore } from "~/stores/assessmentStore"
import { useParticipationStore } from "~/stores/participationStore"

async function verifyAssessment(to) {
  // only execute middleware on client-side because cookie not working on server-side
  if (process.server) return

  const assessmentStore = useAssessmentStore()
  const participationStore = useParticipationStore()
  const assessmentId = to.params.assessmentId || to.query.assessment
  if (assessmentId) {
    assessmentStore.currentAssessmentId = parseInt(assessmentId)
    if (!assessmentStore.currentAssessment) {
      await assessmentStore.getAssessment(assessmentId)
    }
    if (
      !participationStore.currentParticipationId ||
      participationStore.currentParticipationId === -1
    ) {
      await Promise.all([
        participationStore.getParticipationForAssessmentOnce(assessmentId),
        participationStore.loadAssessmentOnce(assessmentId),
      ])
    }
  }
}

export default defineNuxtRouteMiddleware(verifyAssessment)
