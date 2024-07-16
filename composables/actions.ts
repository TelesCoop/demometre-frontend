import { useParticipationStore } from "~/stores/participationStore"
import { useAssessmentStore } from "~/stores/assessmentStore"

export async function getUserData() {
  return Promise.all([
    await useAssessmentStore().getAssessmentsForUser(),
  ])
}

export function cleanUserData(onlyResponses = false) {
  useParticipationStore().onUserLogout()
  useAssessmentStore().onUserLogout(onlyResponses)
}
