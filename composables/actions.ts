import { useProfilingStore } from "~/stores/profilingStore"
import { useAssessmentStore } from "~/stores/assessmentStore"
import { useParticipationStore } from "~/stores/participationStore"

export async function getDataOfParticipation(headers = undefined) {
  const participationStore = useParticipationStore()
  const assessmentStore = useAssessmentStore()
  await Promise.all([
    participationStore.getProfilingQuestionResponses(
      participationStore.id,
      headers
    ),
    participationStore.getQuestionnaireQuestionResponses(
      participationStore.id,
      headers
    ),
    assessmentStore.getAssessment(
      participationStore.participation.assessmentId,
      headers
    ),
  ])
}
