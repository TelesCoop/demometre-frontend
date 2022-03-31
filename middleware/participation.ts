import { useParticipationStore } from "~~/stores/participationStore"

async function verifyParticipation(to) {
  const participationStore = useParticipationStore()
  // Load data if f5
  if (process.server) {
    await participationStore.getParticipation(to.params.participationId)
  }
}

export default defineNuxtRouteMiddleware(verifyParticipation)
