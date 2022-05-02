import { QuestionResponse } from "~/composables/types"

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
  return questionResponse?.[valueName]
}
