import { useParticipationStore } from "~~/stores/participationStore"

async function verifyParticipation(to) {
  const participationStore = useParticipationStore()
  if (to.params.participationId !== participationStore.id) {
    useRouter().push("/")
  }
}

export default defineNuxtRouteMiddleware(verifyParticipation)
