import { useAssessmentStore } from "~/stores/assessmentStore"

export const useAssessmentIsReady = async () => {
  const assessmentStore = useAssessmentStore()
  const route = useRoute()
  const assessmentIdStr: string = (route.params.assessmentId as string)
  const assessmentId = parseInt(assessmentIdStr as string)
  await assessmentStore.assessmentIsReady(assessmentId)
}
