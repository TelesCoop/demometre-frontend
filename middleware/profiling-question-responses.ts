import { useParticipationStore } from "~/stores/participationStore"

async function getProfilingQuestionResponses(to) {
  const participationStore = useParticipationStore()
  if (
    Object.keys(participationStore.responseByProfilingQuestionId).length === 0
  ) {
    return await participationStore.getProfilingQuestionResponses(
      to.params.participationId
    )
  }
}

export default defineNuxtRouteMiddleware(getProfilingQuestionResponses)
