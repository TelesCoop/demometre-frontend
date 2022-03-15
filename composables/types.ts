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
export enum PillarList {
  REPRESENTATION = "représentation",
  COOPERATION = "coopération",
  TRANSPARENCY = "transparence",
  PARTICIPATION = "participation",
}

export const PillarStrategy = {
  [PillarList.REPRESENTATION]: {
    color: "success",
    picto: "picto-representation.png"
  },
  [PillarList.COOPERATION]: {
    color: "danger",
    picto: "picto-cooperation.png"
  },
  [PillarList.TRANSPARENCY]: {
    color: "info",
    picto: "picto-transparency.png"
  },
  [PillarList.PARTICIPATION]: {
    color: "link",
    picto: "picto-participation.png"
  }
}

export type User = { id: number; email: string; username: string }
export type Pillar = {
  id: number
  code: string
  name: PillarList
  description: string
  markers: number[]
}
export type Marker = {
  id: number
  pillarId: number
  concatenatedCode: string
  name: string
  criterias: number[]
  description: string
  score1: string
  score2: string
  score3: string
  score4: string
}
export type Criteria = {
  id: number
  markerId: number
  concatenatedCode: string
  name: string
  questions: number[]
  thematicTags: number[]
  description: string
  score1: string
  score2: string
  score3: string
  score4: string
}
export type ResponseChoice = {
  id: number
  responseChoice: string
}
export type Question = {
  id: number
  criteriaId: number
  concatenatedCode: string
  name: string
  questionStatement: string
  objectivity: Objectivity
  method: Method
  description: string
  type: QuestionType
  responseChoices: ResponseChoice[]
  min: number
  max: number
  minLabel: string
  maxLabel: string
  legalFrame: string
  useCase: string
  resources: string
}
export type Answer = {
  title: string
  description: string
  answerIndex?: number
  id?: number
}
export type Assessment = { id: number; zipCode: string[]; type: string }
export type Homepage = { title: string; introduction: string }
