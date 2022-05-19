import { useParticipationStore } from "~/stores/participationStore"

export const getParticipationUserData = async (headers = undefined) => {
  const participationStore = useParticipationStore()
  if (!participationStore.id) {
    if (await participationStore.getCurrentParticipation(headers)) {
      await getDataOfParticipation(headers)
    }
  }
}
