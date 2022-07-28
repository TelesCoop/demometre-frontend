import { computed, getCurrentInstance } from "vue"
import { useProfilingStore } from "~/stores/profilingStore"
import {
  Assessment,
  Objectivity,
  Participation,
  Question,
  SurveyType,
} from "~/composables/types"
import { useParticipationStore } from "~/stores/participationStore"
import { useRouter } from "#app"
import { useQuestionnaireStore } from "~/stores/questionnaireStore"
import { useAssessmentStore } from "~/stores/assessmentStore"
import { useUserStore } from "~/stores/userStore"

type QuestionDataFilter = {
  question: Question
  participation: Participation | undefined
  assessment: Assessment
}
const QUESTION_FILTERS = {
  role({ question, participation }: QuestionDataFilter): boolean {
    return question.roleIds.includes(participation.roleId)
  },
  population({ question, assessment }: QuestionDataFilter) {
    const population =
      assessment?.municipality?.population || assessment?.epci?.population || 0
    return (
      (!question.populationLowerBound ||
        question.populationLowerBound <= population) &&
      (!question.populationUpperBound ||
        question.populationUpperBound >= population)
    )
  },
  profile({ question, participation }: QuestionDataFilter): boolean {
    return (
      !question.profileIds?.length ||
      question.profileIds.some((profileId) =>
        participation.profileIds.includes(profileId)
      )
    )
  },
  assessmentType({ question, assessment }: QuestionDataFilter) {
    return (
      !question.assessmentTypes ||
      question.assessmentTypes?.includes(assessment?.assessmentType)
    )
  },
}

const QUESTION_FILTERS_VALUES = Object.values(QUESTION_FILTERS)

const OPERATORS_STRATEGY = {
  or: "some",
  and: "every",
}

const NUMERICAL_OPERATOR_STRATEGY = {
  "<": (x, y) => {
    return x < y
  },
  ">": (x, y) => {
    return x > y
  },
  "<=": (x, y) => {
    return x <= y
  },
  ">=": (x, y) => {
    return x >= y
  },
  "!=": (x, y) => {
    return x !== y
  },
  "=": (x, y) => {
    return x === y
  },
}

const RULES_STRATEGY = {
  unique_choice: ({ rule, response }): boolean => {
    return Boolean(
      rule.responseChoiceIds?.includes(response?.uniqueChoiceResponseId)
    )
  },
  multiple_choice: ({ rule, response }): boolean => {
    return Boolean(
      rule.responseChoiceIds?.some((item) =>
        response?.multipleChoiceResponseIds?.includes(item)
      )
    )
  },
  boolean: ({ rule, response }): boolean => {
    return Boolean(rule.booleanResponse === response.booleanResponse)
  },
  percentage: ({ rule, response }): boolean => {
    return Boolean(
      NUMERICAL_OPERATOR_STRATEGY[rule.numericalOperator]?.(
        response.percentageResponse,
        rule.numericalValue
      )
    )
  },
  closed_with_scale: ({ rule, response }): boolean => {
    return true
  },
}

function isRelevant(question: Question, data) {
  const operator: string =
    OPERATORS_STRATEGY[question.rulesIntersectionOperator]
  return question.rules[operator]((rule) => {
    const response = data.responseByQuestionId[rule.conditionalQuestionId]
    return RULES_STRATEGY[rule.type]({ rule, response })
  })
}

export function useProfilingJourney<Type>() {
  const vm = getCurrentInstance()
  const journey = computed(() => {
    const profilingStore = useProfilingStore()
    const participationStore = useParticipationStore()
    const assessmentStore = useAssessmentStore()
    const participation = participationStore.participation
    const assessment = assessmentStore.currentAssessment
    const responseByQuestionId =
      participationStore.responseByProfilingQuestionId
    const questionIds = profilingStore.orderedQuestionId
      .filter((questionId) => {
        const question = profilingStore.questionById[questionId]
        return QUESTION_FILTERS_VALUES.every((test) =>
          test({ question, participation, assessment })
        )
      })
      .filter((questionId) => {
        const question = profilingStore.questionById[questionId]
        return isRelevant.bind(vm)(question, { responseByQuestionId })
      })
    return questionIds
  })
  const nextQuestionId = (
    currentQuestionId: number,
    nextQuestion: boolean
  ): number => {
    const myJourney = journey.value
    const index = myJourney.indexOf(currentQuestionId)
    return nextQuestion ? myJourney[index + 1] : myJourney[index - 1]
  }

  const goToNextQuestion = (currentQuestionId: number) => {
    const userStore = useUserStore()
    if (isLastQuestion(currentQuestionId)) {
      useRouter().push("/evaluation/affinage/validation")
    } else {
      const questionId = nextQuestionId(currentQuestionId, true)
      useRouter().push(`/evaluation/affinage/${questionId}`)
    }
  }

  const goToPreviousQuestion = (currentQuestionId: number) => {
    const userStore = useUserStore()
    if (!isFirstQuestion(currentQuestionId)) {
      const questionId = nextQuestionId(currentQuestionId, false)
      useRouter().push(`/evaluation/affinage/${questionId}`)
    }
  }

  const isLastQuestion = (currentQuestionId: number): boolean => {
    const myJourney = journey.value
    const index = myJourney.indexOf(currentQuestionId)
    return index + 1 === myJourney.length
  }

  const isFirstQuestion = (currentQuestionId: number): boolean => {
    const myJourney = journey.value
    return myJourney.indexOf(currentQuestionId) === 0
  }

  const surveyType = (): SurveyType => {
    return SurveyType.PROFILING
  }

  return {
    journey,
    nextQuestionId,
    goToNextQuestion,
    goToPreviousQuestion,
    isLastQuestion,
    isFirstQuestion,
    surveyType,
  }
}

export function useQuestionnaireJourney<Type>(pillarName: string) {
  const journey = computed(() => {
    const questionnaireStore = useQuestionnaireStore()
    const participationStore = useParticipationStore()
    const assessmentStore = useAssessmentStore()
    const questionIds = questionnaireStore
      .getQuestionnaireQuestionByPillarName(pillarName)
      .filter((question: Question) => {
        const participation = participationStore.participation
        const assessment = assessmentStore.currentAssessment
        return (
          QUESTION_FILTERS_VALUES.every((test) =>
            test({ question, participation, assessment })
          ) &&
          // the objective questions are shown only to assessment admin users
          (assessmentStore.userIsAssessmentInitiator
            ? true
            : question.objectivity === Objectivity.SUBJECTIVE)
        )
      })
      .map((question: Question) => question.id)
    return questionIds
  })
  const nextQuestionId = (
    currentQuestionId: number,
    nextQuestion: boolean
  ): number => {
    const myJourney = journey.value
    const index = myJourney.indexOf(currentQuestionId)
    return nextQuestion ? myJourney[index + 1] : myJourney[index - 1]
  }

  const goToNextQuestion = (currentQuestionId: number) => {
    const userStore = useUserStore()
    if (isLastQuestion(currentQuestionId)) {
      useRouter().push("/evaluation/questionnaire")
    } else {
      const questionId = nextQuestionId(currentQuestionId, true)
      useRouter().push({
        path: `/evaluation/questionnaire/${questionId}`,
        query: { pillar: pillarName },
      })
    }
  }

  const goToPreviousQuestion = (currentQuestionId: number) => {
    const userStore = useUserStore()
    if (isFirstQuestion(currentQuestionId)) {
      useRouter().push("/evaluation/questionnaire")
    } else {
      const questionId = nextQuestionId(currentQuestionId, false)
      useRouter().push({
        path: `/evaluation/questionnaire/${questionId}`,
        query: { pillar: pillarName },
      })
    }
  }

  const isLastQuestion = (currentQuestionId: number): boolean => {
    const myJourney = journey.value
    const index = myJourney.indexOf(currentQuestionId)
    return index + 1 === myJourney.length
  }

  const isFirstQuestion = (currentQuestionId: number): boolean => {
    const myJourney = journey.value
    return myJourney.indexOf(currentQuestionId) === 0
  }

  const surveyType = (): SurveyType => {
    return SurveyType.QUESTIONNAIRE
  }

  return {
    journey,
    nextQuestionId,
    goToNextQuestion,
    goToPreviousQuestion,
    isLastQuestion,
    isFirstQuestion,
    surveyType,
  }
}

export function useInitializationJourney<Type>() {
  const vm = getCurrentInstance()
  const journey = computed(() => {
    const questionnaireStore = useQuestionnaireStore()
    const assessmentStore = useAssessmentStore()
    const questionIds = questionnaireStore.questions
      .filter((question: Question) => {
        const assessment = assessmentStore.currentAssessment
        const participation = undefined
        return (
          QUESTION_FILTERS.population({
            question,
            participation,
            assessment,
          }) &&
          QUESTION_FILTERS.assessmentType({
            question,
            participation,
            assessment,
          }) &&
          question.objectivity === Objectivity.OBJECTIVE
        )
      })
      .map((question: Question) => question.id)
    return questionIds
  })
  const nextQuestionId = (
    currentQuestionId: number,
    nextQuestion: boolean
  ): number => {
    const myJourney = journey.value
    const index = myJourney.indexOf(currentQuestionId)
    return nextQuestion ? myJourney[index + 1] : myJourney[index - 1]
  }

  const goToNextQuestion = (currentQuestionId: number) => {
    const assessmentStore = useAssessmentStore()
    if (isLastQuestion(currentQuestionId)) {
      useRouter().push({
        path: `/evaluation/initialisation/${assessmentStore.currentAssessmentId}/validation`,
      })
    } else {
      const questionId = nextQuestionId(currentQuestionId, true)
      useRouter().push({
        path: `/evaluation/initialisation/${assessmentStore.currentAssessmentId}/questions-objectives/${questionId}`,
      })
    }
  }

  const goToPreviousQuestion = (currentQuestionId: number) => {
    const assessmentStore = useAssessmentStore()
    if (isFirstQuestion(currentQuestionId)) {
      useRouter().push(
        `/evaluation/initialisation/${assessmentStore.currentAssessmentId}/questions-objectives`
      )
    } else {
      const questionId = nextQuestionId(currentQuestionId, false)
      useRouter().push({
        path: `/evaluation/initialisation/${assessmentStore.currentAssessmentId}/questions-objectives/${questionId}`,
      })
    }
  }

  const isLastQuestion = (currentQuestionId: number): boolean => {
    const myJourney = journey.value
    const index = myJourney.indexOf(currentQuestionId)
    return index + 1 === myJourney.length
  }

  const isFirstQuestion = (currentQuestionId: number): boolean => {
    const myJourney = journey.value
    return myJourney.indexOf(currentQuestionId) === 0
  }

  const surveyType = (): SurveyType => {
    return SurveyType.INITILIZATION
  }

  return {
    journey,
    nextQuestionId,
    goToNextQuestion,
    goToPreviousQuestion,
    isLastQuestion,
    isFirstQuestion,
    surveyType,
  }
}
