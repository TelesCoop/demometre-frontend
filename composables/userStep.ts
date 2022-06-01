import { computed } from "vue"
import { useParticipationStore } from "~/stores/participationStore"
import { useAssessmentStore } from "~/stores/assessmentStore"
import {
  useProfilingJourney,
  useInitializationJourney,
} from "~/composables/journey"

const START_EVALUATION_TEXT = " Lancer l'évaluation"
const RESUME_EVALUATION_TEXT = "Reprendre l'évaluation"
export function useUserStep<Type>() {
  const assessmentStore = useAssessmentStore()
  const participationStore = useParticipationStore()
  const profilingJourney = useProfilingJourney()
  const initilizationJourney = useInitializationJourney()

  const state = computed(() => {
    if (!assessmentStore.currentAssessmentId) {
      return {
        step: "localisation",
        url: `/evaluation`,
        text: START_EVALUATION_TEXT,
      }
    }
    if (!assessmentStore.currentAssessment?.initializationDate) {
      return {
        step: "initialization",
        url: `/evaluation/initialisation?assessment=${assessmentStore.currentAssessmentId}`,
        text: START_EVALUATION_TEXT,
      }
    }
    if (
      !assessmentStore.currentAssessment?.isInitializationQuestionsCompleted &&
      assessmentStore.userIsAssessmentAdmin
    ) {
      const questionId = initilizationJourney.nextQuestionId(undefined, true)

      return {
        step: "initialization-objectives-questions",
        url: `/evaluation/initialisation/${assessmentStore.currentAssessmentId}/questions-objectives/${questionId}`,
        text: START_EVALUATION_TEXT,
      }
    }
    if (!participationStore.id) {
      return {
        step: "role",
        url: `/evaluation/localisation/${assessmentStore.currentAssessmentId}`,
        text: RESUME_EVALUATION_TEXT,
      }
    }

    if (!participationStore.participation.isProfilingQuestionsCompleted) {
      const questionId = profilingJourney.nextQuestionId(undefined, true)
      return {
        step: "profiling",
        url: `/evaluation/affinage/${questionId}`,
        text: RESUME_EVALUATION_TEXT,
      }
    }

    return {
      step: "questionnaire",
      url: "/evaluation/questionnaire",
      text: RESUME_EVALUATION_TEXT,
    }
  })
  return state
}
