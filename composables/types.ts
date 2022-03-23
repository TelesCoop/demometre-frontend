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
export enum PillarName {
  REPRESENTATION = "représentation",
  COOPERATION = "coopération",
  TRANSPARENCY = "transparence",
  PARTICIPATION = "participation",
}

export const PillarParams = {
  [PillarName.REPRESENTATION]: {
    color: "representation",
    picto: "picto-representation.png",
  },
  [PillarName.COOPERATION]: {
    color: "cooperation",
    picto: "picto-cooperation.png",
  },
  [PillarName.TRANSPARENCY]: {
    color: "transparency",
    picto: "picto-transparency.png",
  },
  [PillarName.PARTICIPATION]: {
    color: "participation",
    picto: "picto-participation.png",
  },
}
export const LocalityType = {
  MUNICIPALITY: { key: "municipality", value: "Commune" },
  INTERCOMMUNALITY: { key: "intercommunality", value: "Intercommunalité" },
}

export type User = { id: number; email: string; username: string }
export type PillarType = {
  id: number
  code: string
  name: PillarName
  description: string
  markerIds: number[]
}
export type Marker = {
  id: number
  pillarId: number
  pillarName: PillarName
  concatenatedCode: string
  name: string
  criteriaIds: number[]
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
  questionIds: number[]
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
  description: string
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
  sources: string
  toGoFurther: string
}
type Locality = {
  id: number
  name: string
  population: number
  zip_codes: number[]
}
export type Assessment = {
  id: number
  type: string
  initiated_by: string
  is_initiated_by_locality: Boolean
  carried_by; is_carried_by_locality: Boolean
  initialization_date: string
  end_date: string
  municipality: Locality | null
  epci: Locality | null
}

export type HomePage = { title: string; introduction: string }
export type ReferentialPage = { title: string; introduction: string }
export type EvaluationIntroPage = {
  title: string
  introduction: string
  dataConsent: string
}
