import { computed, getCurrentInstance } from "vue"
import { useProfilingStore } from "~/stores/profilingStore"
import { Question, QuestionResponse } from "~/composables/types"
import { useParticipationStore } from "~/stores/participationStore"
import { rule } from "postcss"

const OPERATORS_STRATEGY = {
  or: "some",
  and: "every",
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
  closed_with_scale: ({ question }): boolean => {
    return Boolean(question)
  },
  boolean: ({ question }): boolean => {
    return Boolean(question)
  },
  numerical: ({ question }): boolean => {
    return Boolean(question)
  },
}

function isRelevant(
  question: Question,
  //{ questionResponse: QuestionResponse }
  data
) {
  const operator: string =
    OPERATORS_STRATEGY[question.rulesIntersectionOperator]
  return question.rules[operator]((rule) => {
    const response = data.responseByQuestionId[rule.conditionalQuestionId]
    return RULES_STRATEGY[rule.type]({ rule, question, response, ...data })
  })
}

export function useJourney<Type>() {
  const vm = getCurrentInstance()
  const journey = computed(() => {
    const profilingStore = useProfilingStore()
    const responseByQuestionId =
      useParticipationStore().responseByProfilingQuestionId
    profilingStore.questions.filter((question) =>
      isRelevant.bind(vm)(question, { responseByQuestionId })
    )
    return []
  })
  const nextQuestionId = (currentQuestionId) => {
    const myJourney = journey.value
    const index = myJourney.indexOf(currentQuestionId)
    return myJourney[index + 1]
  }
  return {
    journey,
    nextQuestionId,
  }
}
