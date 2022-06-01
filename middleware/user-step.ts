import { useUserStep } from "~/composables/userStep"
import { useUserStore } from "~/stores/userStore"

async function verifyRouting(to) {
  if (process.server) {
    // TODO : make work this code, the redirection is effective before anonymous user is load
    const userStore = useUserStore()
    if (
      !!to.query.anonymous &&
      !userStore.anonymous.username &&
      !userStore.anonymousRefreshed
    ) {
      await userStore.refreshAnonymous(to.query.anonymous)
      await getParticipationUserData()
    }

    const userStep = useUserStep().value
    if (userStep.step && userStep.step !== to.meta.step) {
      return navigateTo(userStep.url)
    }
  }
}

export default defineNuxtRouteMiddleware(verifyRouting)
