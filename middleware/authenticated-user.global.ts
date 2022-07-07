import { useUserStore } from "~/stores/userStore"
import { useRequestHeaders } from "#app"
import { getParticipationUserData } from "~/composables/actions"

const loadUserState = async () => {
  // // Conserve header because of crash
  // const headers = useRequestHeaders(["cookie", "csrftoken"])
  // const userStore = useUserStore()
  //
  // if (!userStore.refreshed) {
  //   // if profile is already got from SSR, do not fetch again
  //   await userStore.refreshProfile()
  // }
  //
  // if (userStore.isLoggedIn || userStore.isUnknownUser) {
  //   await getParticipationUserData()
}

export default defineNuxtRouteMiddleware(loadUserState)
