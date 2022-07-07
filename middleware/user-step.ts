import { useUserStep } from "~/composables/userStep"

async function verifyRouting(to) {
  if (process.client) {
    const userStep = useUserStep().value
    if (userStep.step !== to.meta.step) {
      return navigateTo(userStep.url)
    }
  }
}

export default defineNuxtRouteMiddleware(verifyRouting)
