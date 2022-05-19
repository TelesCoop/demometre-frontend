import { useUserStore } from "~/stores/userStore"
import { useRequestHeaders } from "#app"
import { getParticipationUserData } from "~~/utils/user-data"

const loadUserState = async () => {
  if (!process.server) return

  // Conserve header because of crash
  const headers = useRequestHeaders(["cookie"])
  const userStore = useUserStore()

  console.log(headers)

  if (!userStore.refreshed) {
    // if profile is already got from SSR, do not fetch again
    await userStore.refreshProfile(headers)
  }

  if (userStore.isLoggedIn || userStore.isAnonymous) {
    await getParticipationUserData(headers)
  }
}

export default defineNuxtRouteMiddleware(loadUserState)
