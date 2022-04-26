import { computed, getCurrentInstance } from "vue"
import { useProfilingStore } from "~/stores/profilingStore"
import { Question } from "~/composables/types"
import { useParticipationStore } from "~/stores/participationStore"
import { useRouter } from "vue-router"

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
  closed_with_ranking: (): boolean => {
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
    debugger
    const profilingStore = useProfilingStore()
    const responseByQuestionId =
      useParticipationStore().responseByProfilingQuestionId
    const questionIds = profilingStore.orderedQuestionId.filter(
      (questionId) => {
        const question = profilingStore.questionById[questionId]
        return isRelevant.bind(vm)(question, { responseByQuestionId })
      }
    )
    return questionIds
  })
  const nextQuestionId = (currentQuestionId) => {
    const myJourney = journey.value
    const index = myJourney.indexOf(currentQuestionId)
    return myJourney[index + 1]
  }

  const goToNextQuestion = (currentQuestionId) => {
    const questionId = nextQuestionId(currentQuestionId)
    debugger
    useRouter().push(`/evaluation/affinage/${questionId}`)
  }

  return {
    journey,
    nextQuestionId,
    goToNextQuestion,
  }
}

export function useQuestionnaireJourney<Type>() {
  const vm = getCurrentInstance()
  const journey = computed(() => {
    return []
  })
  const nextQuestionId = (currentQuestionId) => {
    return currentQuestionId
  }
  return {
    journey,
    nextQuestionId,
  }
}
