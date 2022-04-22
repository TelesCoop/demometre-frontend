import { useProfilingStore } from "~/stores/profilingStore"
import { useUserStore } from "~/stores/userStore"
import { useParticipationStore } from "~/stores/participationStore"

const loadUserState = async () => {
  const userStore = useUserStore()

  console.log("auth 1 ? ", userStore.isLoggedIn)

  if (!userStore.refreshed) {
    // if profile is already got from SSR, do not fetch again
    await userStore.refreshProfile()
  }

  console.log("auth ? ", userStore.isLoggedIn)
  console.log("participationStore")
  if (userStore.isLoggedIn) {
    if (!process.server) {
      const participationStore = useParticipationStore()
      const profilingStore = useProfilingStore()
      console.log("participationStore")
      console.log("profilingStore")
      console.log("participation ? ", participationStore.id)
      if (!participationStore.id) {
        await participationStore.getCurrentParticipation()
        console.log("participation ? ", participationStore.id)
        // console.log("participation ? ", participationStore.id)
        //     // await Promise.all([
        //     //   participationStore.getProfilingQuestionResponses(participationStore.id),
        //     //   profilingStore.getProfilingQuestions(participationStore.id),
        //     // ])
      }
    }

    return
  }
}

export default defineNuxtRouteMiddleware(loadUserState)
