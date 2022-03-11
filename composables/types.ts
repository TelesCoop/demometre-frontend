export enum Objectivity {
  OBJECTIVE = "objective",
  SUBJECTIVE = "subjective",
}
export enum Method {
  QUANTITATIVE = "quantitative",
  QUALITATIVE = "qualitative",
}
export enum QuestionType {
  OPEN = "open",
  UNIQUE_CHOICE = "unique_choice",
  MULTIPLE_CHOICE = "multiple_choice",
  CLOSED_WITH_RANKING = "closed_with_ranking",
  CLOSED_WITH_SCALE = "closed_with_scale",
  BOOLEAN = "boolean",
  NUMERICAL = "numerical",
}

export type User = { id: number; email: string; username: string }
export type Pillar = {
  id: number
  code: string
  name: string
  description: string
}
export type Marker = {
  id: number
  pillar_id: number
  concatenated_code: string
  name: string
  description: string
  score_1: string
  score_2: string
  score_3: string
  score_4: string
}
export type Criteria = {
  id: number
  marker_id: number
  concatenated_code: string
  name: string
  thematic_tags: [number]
  description: string
  score_1: string
  score_2: string
  score_3: string
  score_4: string
}
export type ResponseChoice = {
  id: number
  response_choice: string
}
export type Question = {
  id: number
  criteria_id: number
  concatenated_code: string
  name: string
  question_statement: string
  objectivity: Objectivity
  method: Method
  description: string
  type: QuestionType
  response_choices: [ResponseChoice]
  min: number
  max: number
  min_label: string
  max_label: string
  legal_frame: string
  use_case: string
  resources: string
}
export type Answer = {
  title: string
  description: string
  answerIndex?: number
  id?: number
}
export type Assessment = { id: number; zipCode: string[]; type: string }
