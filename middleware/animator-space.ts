import { useToastStore } from "~/stores/toastStore"
import { useUserStore } from "~/stores/userStore"

async function verifyIsAnimator(_) {
  const userStore = useUserStore()
  const toastStore = useToastStore()

  if (!userStore.isLoggedIn) {
    toastStore.setInfo("Seule les experts ont accès à cette section")
    navigateTo(`/login`)
  }
  if (!userStore.isExpertUser) {
    toastStore.setInfo("Seule les experts ont accès à cette section")
    navigateTo(`/`)
  }
}

export default defineNuxtRouteMiddleware(verifyIsAnimator)
