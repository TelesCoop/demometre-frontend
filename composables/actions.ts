import { useProfilingStore } from "~/stores/profilingStore"
import { useAssessmentStore } from "~/stores/assessmentStore"
import { useParticipationStore } from "~/stores/participationStore"

export async function getDataOfParticipation(headers = undefined) {
  const participationStore = useParticipationStore()
  const profilingStore = useProfilingStore()
  const assessmentStore = useAssessmentStore()
  await Promise.all([
    participationStore.getProfilingQuestionResponses(
      participationStore.id,
      headers
    ),
    profilingStore.getProfilingQuestions(participationStore.id, headers),
    assessmentStore.getAssessment(
      participationStore.participation.assessmentId,
      headers
    ),
  ])
}
