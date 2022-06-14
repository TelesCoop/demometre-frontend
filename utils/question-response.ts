import { Question, QuestionResponse } from "~/composables/types"

export const QUESTION_RESPONSE_VALUE_BY_TYPE = {
  unique_choice: "uniqueChoiceResponseId",
  multiple_choice: "multipleChoiceResponseIds",
  boolean: "booleanResponse",
  percentage: "percentageResponse",
  closed_with_scale: "percentageResponse",
  closed_with_ranking: "closedWithRankingResponseIds",
}
export const QUESTION_RESPONSES_BY_TYPE = {
  questionnaire: "responseByQuestionnaireQuestionId",
  profiling: "responseByProfilingQuestionId",
}

export const getQuestionResponseValue = (
  questionResponse: QuestionResponse,
  type: string
) => {
  const valueName = QUESTION_RESPONSE_VALUE_BY_TYPE[type]
  const responseValue = questionResponse?.[valueName]
  if (responseValue === true) {
    return 1
  }
  if (responseValue === false) {
    return 0
  }
  return questionResponse?.[valueName]
}

export const getQuestionResponseString = (
  question: Question,
  questionResponse: QuestionResponse
) => {
  const responseValue = getQuestionResponseValue(
    questionResponse,
    question.type
  )
  let responseString = responseValue
  if (
    question.type === "unique_choice" ||
    question.type === "multiple_choice" ||
    question.type === "closed_with_scale"
  ) {
    responseString = question.responseChoices
      .filter((responseChoice) => responseChoice.id === responseValue)
      .map((responseChoice) => responseChoice.responseChoice)
      .join(", ")
  } else if (question.type === "percentage") {
    responseString = responseValue + "%"
  } else if (question.type === "boolean") {
    if (responseValue === 1) {
      return "Oui"
    }
    if (responseValue === 0) {
      return "Non"
    }
  }
  return responseString
}
