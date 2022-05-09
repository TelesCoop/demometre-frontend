import { computed } from "vue"
import { useParticipationStore } from "~/stores/participationStore"
import { useAssessmentStore } from "~/stores/assessmentStore"
import profiling from "~/middleware/profiling"
import { useProfilingJourney } from "~/composables/journey"

const START_EVALUATION_TEXT = " Commencer l'évaluation"
const RESUME_EVALUATION_TEXT = "Reprendre l'évaluation"
export function useUserStep<Type>() {
  const assessmentStore = useAssessmentStore()
  const participationStore = useParticipationStore()
  const profilingJourney = useProfilingJourney()

  const state = computed(() => {
    if (!assessmentStore.currentAssessmentId) {
      return {
        step: "localisation",
        url: `/evaluation`,
        text: START_EVALUATION_TEXT,
      }
    }
    if (!participationStore.id) {
      return {
        step: "role",
        url: `/evaluation/localisation/${assessmentStore.currentAssessmentId}/participation`,
        text: RESUME_EVALUATION_TEXT,
      }
    }

    if (!participationStore.participation.is_profiling_questions_completed) {
      const questionId = profilingJourney.nextQuestionId(undefined)
      return {
        step: "profiling",
        url: `/evaluation/affinage/${questionId}`,
        text: RESUME_EVALUATION_TEXT,
      }
    }

    return {
      step: "questionnaire",
      url: "/",
      text: RESUME_EVALUATION_TEXT,
    }
  })
  return state
}
