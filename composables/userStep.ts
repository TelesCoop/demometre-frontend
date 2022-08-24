import { computed } from "vue"
import { useParticipationStore } from "~/stores/participationStore"
import { useAssessmentStore } from "~/stores/assessmentStore"
import {
  useProfilingJourney,
  useInitializationJourney,
  getLastAnsweredProfilingQuestionId,
  getLastQuestionIdOfIncompletePillar,
  useQuestionnaireJourney,
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
      // No locality chosen, when a locality is chosen we get or create assessment
      return {
        step: "localisation",
        url: `/evaluation/localisation`,
        text: START_EVALUATION_TEXT,
      }
    }
    if (!assessmentStore.currentAssessment?.initializationDate) {
      // The locality has been chosen but the assessment is not initialize
      return {
        step: "initialization",
        url: `/evaluation/initialisation?assessment=${assessmentStore.currentAssessmentId}`,
        text: START_EVALUATION_TEXT,
      }
    }
    if (
      !assessmentStore.currentAssessment?.isInitializationQuestionsCompleted &&
      assessmentStore.userIsAssessmentInitiator
    ) {
      // The assessment is initialize but the objective questions are not completed
      return {
        step: "initialization-objectives-questions",
        url: `/evaluation/initialisation/${assessmentStore.currentAssessmentId}/questions-objectives`,
        text: START_EVALUATION_TEXT,
      }
    }
    if (!participationStore.id) {
      if (
        !participationStore.newParticipation.consent &&
        assessmentStore.userIsAssessmentInitiator
      ) {
        participationStore.newParticipation.consent =
          assessmentStore.currentAssessment.initiatorUsageConsent
      }
      if (!participationStore.newParticipation.consent) {
        // If the consent is not checked we go to the beginning of the participation
        return {
          step: "participation",
          url: `/evaluation/participation/${assessmentStore.currentAssessmentId}`,
          text: RESUME_EVALUATION_TEXT,
        }
      }
      if (assessmentStore.addingExpert) {
        return {
          step: "participation",
          url: `/evaluation/participation/${assessmentStore.currentAssessmentId}/ajout-expert`,
          text: RESUME_EVALUATION_TEXT,
        }
      }
      return {
        step: "role",
        url: `/evaluation/participation/${assessmentStore.currentAssessmentId}/tableau-de-bord`,
        text: RESUME_EVALUATION_TEXT,
      }
    }

    if (!participationStore.participation.isProfilingQuestionsCompleted) {
      const lastAnsweredQuestionId = getLastAnsweredProfilingQuestionId()

      // If there is a participation but the profiling is not completed
      const questionId = profilingJourney.nextQuestionId(
        lastAnsweredQuestionId,
        true
      )
      return {
        step: "profiling",
        url: `/evaluation/affinage/${questionId}`,
        text: RESUME_EVALUATION_TEXT,
      }
    }

    const { pillarName, lastQuestionId } = getLastQuestionIdOfIncompletePillar()
    let url = "/evaluation/questionnaire"
    if (lastQuestionId) {
      const questionnaireJourney = useQuestionnaireJourney(pillarName)
      const questionId = questionnaireJourney.nextQuestionId(
        lastQuestionId,
        true
      )
      if (questionId) {
        url = `/evaluation/questionnaire/${questionId}?pillar=${pillarName}`
      }
    }
    return {
      step: "questionnaire",
      url: url,
      text: RESUME_EVALUATION_TEXT,
    }
  })
  return state
}
