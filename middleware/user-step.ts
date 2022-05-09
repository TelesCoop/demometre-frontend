import { useUserStep } from "~/composables/userStep"

async function verifyRouting(to) {
  const userStep = useUserStep().value
  if (userStep.step !== to.meta.step) {
    useRouter().push(userStep.url)
  }
}

export default defineNuxtRouteMiddleware(verifyRouting)
