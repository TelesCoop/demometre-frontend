export type User = { id: number | null; email: string; username: string }

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
export enum SurveyType {
  PROFILING = "profiling",
  QUESTIONNAIRE = "questionnaire",
  INITILIZATION = "initilization",
}
export enum PillarName {
  REPRESENTATION = "représentation",
  TRANSPARENCY = "transparence",
  PARTICIPATION = "participation",
  COOPERATION = "coopération",
}

export const PillarParams = {
  [PillarName.REPRESENTATION]: {
    key: "representation",
    color: "representation",
    picto: "picto-representation.png",
  },
  [PillarName.TRANSPARENCY]: {
    key: "transparency",
    color: "transparency",
    picto: "picto-transparency.png",
  },
  [PillarName.PARTICIPATION]: {
    key: "participation",
    color: "participation",
    picto: "picto-participation.png",
  },
  [PillarName.COOPERATION]: {
    key: "cooperation",
    color: "cooperation",
    picto: "picto-cooperation.png",
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
  legalFrame: string
  useCase: string
  sources: string
  toGoFurther: string
  definitionIds: number[]
}
export type ResponseChoice = {
  id: number
  responseChoice: string
  description: string
}

export type Rule = {
  id: number
  type: string
  // Id de la question définissant la règle
  conditionalQuestionId: number

  // Type de réponse possible pour la rules
  responseChoiceIds: number
  numericalOperator: string
  numericalValue: number
  booleanResponse: boolean
}

export type Question = {
  id: number
  criteriaId: number | null
  pillarId: number | null
  pillarName: PillarName | null
  concatenatedCode: string
  name: string
  questionStatement: string
  mandatory: boolean
  objectivity: Objectivity
  method: Method
  description: string
  type: QuestionType
  responseChoices: ResponseChoice[]
  categories: Category[]
  rulesIntersectionOperator: string
  rules: Rule[]
  surveyType: SurveyType
  maxMultipleChoices: number | null
  roleIds: number[]
  populationLowerBound: number | null
  populationUpperBound: number | null
  profileIds: number[]
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
type CountByResponseChoice = {
  responseChoiceName: string
  responseChoiceId: number
  total: number
}

export type RepresentativityCriteria = {
  id: number
  name: string
  profilingQuestionId: number
  countByResponseChoice: CountByResponseChoice[]
  acceptabilityThreshold: number
  responseChoiceStatements: string[]
  minRate: number
}
export type Assessment = {
  id: number
  localityType: string
  initiatedByUser: User
  initiatorType: string
  initializedToTheNameOf: string
  publicInitiator: boolean
  initializationDate: string
  isInitializationQuestionsCompleted: boolean
  endDate: string
  municipality: Locality | null
  epci: Locality | null
  participationNb: number
  representativities: RepresentativityCriteria[]
}
export const InitiatorType = {
  COLLECTIVITY: { key: "collectivity", value: "Ma collectivité" },
  ASSOCIATION: { key: "association", value: "Une association" },
}

// User participation
export type ParticipationPillarCompleted = {
  id: number | null
  completed: boolean
  pillarId: number
  participationId: number
}
export type Participation = {
  id: number | null
  assessmentId: number
  roleId: number
  consent: boolean
  isProfilingQuestionsCompleted: boolean
  isPillarQuestionsCompleted: ParticipationPillarCompleted[]
  profileIds: number[]
}
export type QuestionResponse = {
  id: number
  participationId: number | null
  assessmentId: number | null
  questionId: number
  hasPassed: boolean
  uniqueChoiceResponseId: number | null
  multipleChoiceResponseIds: number[]
  booleanResponse: boolean | null
  percentageResponse: number | null
  closedWithRankingResponseIds: number[]
  closedWithScaleCategoryResponses: {
    category: string
    responseId: number
  }[]
}

// Pages
type Feedback = {
  id: number
  personName: string
  pictureUrl: string
  personContext: string
  quote: string
  publish: boolean
}
export type Article = {
  id: number
  title: string
  shortDescription: string
  publicationDate: string
  imageUrl: string
  externalLink: string
  pillars: number[]
}
type Partner = {
  id: number
  name: string
  logoImageUrl: string
}
export type HomePage = {
  title: string
  introduction: string
  tagLine: string
  introImageUrl: string
  introYoutubeVideoId: string
  feedbackBlockTitle: string
  feedbackBlockIntro: string
  feedbacks: Feedback[]
  blogBlockTitle: string
  blogBlockIntro: string
  blogPosts: Article[]
  resourcesBlockTitle: string
  resourcesBlockIntro: string
  resources: Article[]
  partnerBlockTitle: string
  partnerBlockIntro: string
  partners: Partner[]
}
export type ReferentialPage = {
  title: string
  introduction: string
  pillarBlockTitle: string
  pillarBlockContent: string
  pillarBlockImageUrl: string
  markerBlockTitle: string
  markerBlockContent: string
  criteriaBlockTitle: string
  criteriaBlockContent: string
}

type ImageUrl = { id: number; url: string }
type AssessmentTypeDetails = {
  id: number
  name: string
  assessmentType: string
  title: string
  forWho: string
  what: string
  forWhat: string
  results: string
  price: string
  pdfUrl: string
  pdf_button: string
}
type StepOfUse = {
  image: number
  imageUrl: string
  title: string
  description: string
}
export type UsagePage = {
  title: string
  introduction: string
  tagLine: string
  introImageUrl: string
  stepOfUseTitle: string
  stepOfUseIntro: string
  stepsOfUse: string | StepOfUse[]
  stepsImagesUrl: ImageUrl[]
  participateBlockTitle: string
  participateBlockIntro: string
  participateLeftParagraph: string
  participateRightParagraph: string
  startAssessmentBlockTitle: string
  startAssessmentBlockIntro: string
  startAssessmentBlockData: string | AssessmentTypeDetails[]
  assessmentTypesDetails: AssessmentTypeDetails[]
}
export type EvaluationIntroPage = {
  title: string
  introduction: string
  dataConsent: string
  accountIncentive: string
  accountIncentiveTitle: string
}
export type EvaluationInitPage = {
  title: string
  introduction: string
  publicNameQuestion: string
  publicNameQuestionDescription: string
  representativityQuestion: string
  representativityDescription: string
  initializationValidation: string
}

// Props
export type QuestionContextProps = {
  journey: any
  questionById: { [key: number]: Question }
  responseByQuestionId: { [key: number]: QuestionResponse }
  hasPreviousStep: boolean
}
