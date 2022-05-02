import { useUserStore } from "~/stores/userStore"
import { useParticipationStore } from "~/stores/participationStore"
import { useRequestHeaders } from "#app"
import { getDataOfParticipation } from "~/composables/actions"

const loadUserState = async () => {
  if (!process.server) return

  // Conserve header because of crash
  const headers = useRequestHeaders(["cookie"])
  const userStore = useUserStore()

  if (!userStore.refreshed) {
    // if profile is already got from SSR, do not fetch again
    await userStore.refreshProfile(headers)
  }

  if (userStore.isLoggedIn) {
    const participationStore = useParticipationStore()
    if (!participationStore.id) {
      if (await participationStore.getCurrentParticipation(headers)) {
        console.log("JE ne suis pas sensé arrivé ici")
        await getDataOfParticipation(headers)
      }
    }
  }
}

export default defineNuxtRouteMiddleware(loadUserState)
