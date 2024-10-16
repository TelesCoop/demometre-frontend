import { useAssessmentStore } from "~/stores/assessmentStore"
import { useParticipationStore } from "~/stores/participationStore"

export const useAssessmentAndParticipationReady = () => {
  const assessmentStore = useAssessmentStore()
  const participationStore = useParticipationStore()
  const route = useRoute()

  const assessmentIdStr: string = ((route.params.assessmentId || route.query.assessment) as string)
  const timeoutDone = ref(false)

  console.log("### useAssessmentAndParticipationReady ready ?")
  setTimeout(() => {
    timeoutDone.value = true
  }, 3000)

  const isReady = computed(() => {
    console.log("### useAssessmentAndParticipationReady ready ?", timeoutDone.value)
    return timeoutDone.value
    console.log("### useAssessmentAndParticipationReady ready ?", assessmentIdStr)
    if (!assessmentIdStr || isNaN(parseInt(assessmentIdStr))) {
      console.log("### useAssessmentAndParticipationReady no assessmentIdStr")
      return true
    }
    const assessmentId = parseInt(assessmentIdStr)
    console.log("### useAssessmentAndParticipationReady", assessmentStore.assessmentById[assessmentId] != null
      && participationStore.fetchedParticipations[assessmentId]
      && participationStore.fetchedLoadParticipations[assessmentId])
    return assessmentStore.assessmentById[assessmentId] != null
      && participationStore.fetchedParticipations[assessmentId]
      && participationStore.fetchedLoadParticipations[assessmentId]
  })

  if (assessmentIdStr && !isNaN(parseInt(assessmentIdStr))) {
    const assessmentId = parseInt(assessmentIdStr)
    assessmentStore.currentAssessmentId = assessmentId
    if (!assessmentStore.currentAssessment) {
      assessmentStore.getAssessmentOnce(assessmentId)
    }
    if (!participationStore.currentParticipationId || participationStore.currentParticipationId === -1) {
      Promise.all([
        participationStore.getParticipationForAssessmentOnce(assessmentId),
        participationStore.loadAssessmentOnce(assessmentId),
      ])
    }
    console.log("### useAssessmentAndParticipationReady loading launched for", assessmentId)
  } else {
    console.log("### useAssessmentAndParticipationReady was already ready")
  }

  return { isReady }
}
