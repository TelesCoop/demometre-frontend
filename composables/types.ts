// Questionnaire and profiling
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
  PERCENTAGE = "percentage",
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
  criteriaId: number | null
  concatenatedCode: string
  name: string
  questionStatement: string
  objectivity: Objectivity
  method: Method
  description: string
  type: QuestionType
  responseChoices: ResponseChoice[]
  legalFrame: string
  useCase: string
  sources: string
  toGoFurther: string
  definitionIds: number[]
  categories: Category[]
}

type Bound = { value: number; label: string }
export type QuestionBounds = { min: Bound; max: Bound }

export type Category = { id: number; category: string }

export type Role = {
  id: number
  name: string
  description: string
}

// Definition
export type Definition = {
  id: number
  word: string
  explanation: string
}

// Assessment
export const LocalityType = {
  MUNICIPALITY: { key: "municipality", value: "Commune" },
  INTERCOMMUNALITY: { key: "intercommunality", value: "Intercommunalité" },
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
  initiatedBy: string
  isInitiatedByLocality: boolean
  carriedBy: string
  isCarriedByLocality: boolean
  initializationDate: string
  endDate: string
  municipality: Locality | null
  epci: Locality | null
  participationNb: number
}

// User participation
export type User = { id: number | null; email: string; username: string }
export type Participation = {
  id: number | null
  userId: number
  assessmentId: number
  roleId: number
  consent: boolean
}

// Pages
export type HomePage = { title: string; introduction: string }
export type ReferentialPage = { title: string; introduction: string }
export type EvaluationIntroPage = {
  title: string
  introduction: string
  dataConsent: string
  accountIncentive: string
  accountIncentiveTitle: string
}
