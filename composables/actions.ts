import { useParticipationStore } from "~/stores/participationStore"
import { useAssessmentStore } from "~/stores/assessmentStore"

export async function getUserData() {
  const participationStore = useParticipationStore()
  return Promise.all([
    await participationStore.getCurrentParticipation(),
    await useAssessmentStore().getCurrentAssessment(),
    await participationStore.getCurrentProfilingQuestionResponses(),
    await participationStore.getCurrentQuestionnaireSubjectiveQuestionResponses(),
    await participationStore.getCurrentQuestionnaireObjectiveQuestionResponses(),
  ])
}

export function cleanUserData() {
  useParticipationStore().logoutUser()
  useAssessmentStore().logoutUser()
}
