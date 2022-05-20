import { useUserStep } from "~/composables/userStep"
// import { useUserStore } from "~/stores/userStore"

async function verifyRouting(to, from) {
  // const userStore = useUserStore()
  // if (!!to.query.anonymous && !userStore.anonymous.username && !userStore.anonymousRefreshed) {
  //   await userStore.refreshAnonymous(to.query.anonymous)
  //   await getParticipationUserData()
  // }

  const userStep = useUserStep().value

  if (userStep.step !== to.meta.step) {
    return navigateTo(userStep.url)
  }
}

export default defineNuxtRouteMiddleware(verifyRouting)
