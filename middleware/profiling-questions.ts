import { useProfilingStore } from "~/stores/profilingStore"

async function getProfilingQuestions(to) {
  const profilingStore = useProfilingStore()
  if (profilingStore.orderedQuestionId.length === 0) {
    return await profilingStore.getProfilingQuestions(to.params.participationId)
  }
}

export default defineNuxtRouteMiddleware(getProfilingQuestions)
