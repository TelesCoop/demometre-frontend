import { useProfilingStore } from "~/stores/profilingStore"
import { useUserStore } from "~/stores/userStore"
import { useParticipationStore } from "~/stores/participationStore"
import { useRequestHeaders } from "#app"

const loadUserState = async () => {
  console.log("loadUserState")

  // Conserve header because of crash
  const headers = useRequestHeaders(["cookie"])
  const userStore = useUserStore()

  if (!userStore.refreshed) {
    // if profile is already got from SSR, do not fetch again
    await userStore.refreshProfile(headers)
  }

  if (userStore.isLoggedIn) {
    const participationStore = useParticipationStore()
    const profilingStore = useProfilingStore()
    if (!participationStore.participation.id) {
      console.log("reload participation and questions / responses")
      if (await participationStore.getCurrentParticipation(headers)) {
        await Promise.all([
          participationStore.getProfilingQuestionResponses(
            participationStore.participation.id,
            headers
          ),
          profilingStore.getProfilingQuestions(participationStore.id, headers),
        ])
      }
    }
  }
}

export default defineNuxtRouteMiddleware(loadUserState)
