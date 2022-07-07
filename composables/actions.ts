import { useAssessmentStore } from "~/stores/assessmentStore"
import { useParticipationStore } from "~/stores/participationStore"

export async function getDataOfParticipation() {
  const participationStore = useParticipationStore()
  const assessmentStore = useAssessmentStore()
  // await Promise.all([
  //   participationStore.getProfilingQuestionResponses(participationStore.id),
  //   participationStore.getQuestionnaireQuestionResponses(
  //     participationStore.id,
  //     participationStore.participation.assessmentId
  //   ),
  //   assessmentStore.getAssessment(
  //     participationStore.participation.assessmentId
  //   ),
  // ])
}

export async function getParticipationUserData() {
  const participationStore = useParticipationStore()
  if (!participationStore.id) {
    if (await participationStore.getCurrentParticipation()) {
      await getDataOfParticipation()
    }
  }
}
