import { useParticipationStore } from "~/stores/participationStore"
import { useProfilingStore } from "~/stores/profilingStore"
import { useUserStore } from "~/stores/userStore"

const userStore = useUserStore()
if (userStore.isLoggedIn) {
  const participationStore = useParticipationStore()
  const profilingStore = useProfilingStore()
  console.log("participationStore")
  console.log("profilingStore")
  console.log("participation ? ", participationStore.id)
  if (!participationStore.id) {
    await participationStore.getCurrentParticipation()
  }
}
