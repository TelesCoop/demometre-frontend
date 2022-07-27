export type User = {
  id: number | null
  email: string
  username: string
  isExpert: boolean
  isUnknownUser: boolean
}

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
  },
  [PillarName.TRANSPARENCY]: {
    key: "transparency",
    color: "transparency",
  },
  [PillarName.PARTICIPATION]: {
    key: "participation",
    color: "participation",
  },
  [PillarName.COOPERATION]: {
    key: "cooperation",
    color: "cooperation",
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
  definitionIds: number[]
  explanatory: string | SimpleBlock[]
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
  assessmentTypes: string[]
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
export const AssessmentType = {
  QUICK: { key: "quick", value: "Diagnostic rapide" },
  PARTICIPATIVE: { key: "participative", value: "Evaluation participative" },
  WITH_EXPERT: { key: "with_expert", value: "Evaluation avec experts" },
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
  ignoreForAcceptabilityThreshold: boolean
}

export type RepresentativityCriteria = {
  id: number
  name: string
  profilingQuestionId: number
  acceptabilityThreshold: number
  minRate: number
  explanation: string
}
export type AssessmentRepresentativity = {
  id: number
  assessmentId: number
  representativityCriteriaName: string
  countByResponseChoice: CountByResponseChoice[]
  acceptabilityThresholdConsidered: number
  respected: boolean
}
export type Assessment = {
  id: number
  assessmentType: string
  conditionsOfSaleConsent: boolean
  initiatorUsageConsent: boolean
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
  representativities: AssessmentRepresentativity[]
  name: string
  publishedResults: boolean
}
export const InitiatorType = {
  COLLECTIVITY: { key: "collectivity", value: "Ma collectivité" },
  ASSOCIATION: { key: "association", value: "Une association" },
  INDIVIDUAL: { key: "individual", value: "Un particulier" },
  OTHER: { key: "other", value: "Autre" },
}
export type Scores = {
  byQuestionId: { [key: number]: number }
  byCriteriaId: { [key: number]: number }
  byMarkerId: { [key: number]: number }
  byPillarId: { [key: number]: number }
}
export type StrenghtsAndImprovements = {
  strengths: string[]
  improvements: string[]
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
  isCurrent: boolean
}
export type ClosedWithScaleResponse = {
  id: number | null
  categoryId: number
  responseChoiceId: number | null
  participationResponseId: number | null
  assessmentResponseId: number | null
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
  closedWithScaleResponseCategories: ClosedWithScaleResponse[]
}

// Workshops
export type Workshop = {
  id: number
  assessmentId: number
  date: string
  name: string
  animatorId: number
  participationIds: number[]
  changed: boolean
  closed: boolean
}
export type WorkshopParticipation = {
  id: number
  participantEmail: string
  participantName: string
  assessmentId: number
  roleId: number
  responses: QuestionResponse[]
  responseByQuestionId: { [key: number]: QuestionResponse }
  changed: boolean
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
  height: number
  showInHomePage: boolean
}
type Person = {
  id: number
  name: string
  imageUrl: string
  jobTitle: string
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
  pillarBlockLeftContent: string
  pillarBlockRightContent: string
  pillarBlockImageUrl: string
  markerBlockTitle: string
  markerBlockContent: string
  criteriaBlockTitle: string
  criteriaBlockLeftContent: string
  criteriaBlockRightContent: string
}
export type ResultsPage = {
  title: string
  tagLine: string
  tagLineNoResults: string
  introduction: string
  introImageUrl: string
}

type ImageUrl = { id: number; url: string }
export type AssessmentTypeDetails = {
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
type SimpleBlockWithImage = {
  image: number
  imageUrl: string
  title: string
  description: string
}
export type SimpleBlock = {
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
  stepsOfUse: string | SimpleBlockWithImage[]
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
type ObjectiveBlock = {
  svg: number
  svgUrl: string
  title: string
}
type CommitteeMember = {
  id: string
  type: string
  value: number
}
type CommitteeSubBlockValue = {
  committee: string
  committeeMembers: CommitteeMember
}
export type CommitteeSubBlock = {
  id: string
  type: string
  value: CommitteeSubBlockValue
}
export type ProjectPage = {
  title: string
  introduction: string
  tagLine: string
  introImageUrl: string | null
  whyBlockTitle: string
  whyBlockData: string
  objectiveBlockTitle: string
  objectiveBlockData: string | ObjectiveBlock[]
  impactBlockTitle: string
  impactBlockData: string | SimpleBlockWithImage[]
  whoBlockTitle: string
  whoCrewSubBlockTitle: string
  whoCrewSubBlockImageUrl: ImageUrl
  whoCrewSubBlockMemberIds: number[]
  whoCommitteeSubBlockTitle: string
  whoCommitteeSubBlockDescription: string
  whoCommitteeSubBlockData: string | CommitteeSubBlock[]
  whoPartnerSubBlockTitle: string
  whoPartnerSubBlockData: string
  howBlockTitle: string
  howBlockData: string
  imagesUrl: ImageUrl[]
  svgsUrl: ImageUrl[]
  persons: Person[]
  partners: Partner[]
}
export type EvaluationInitiationPage = {
  searchAssessmentTitle: string
  searchAssessmentDescription: string
  cguConsentTitle: string
  cguConsentDescriptionLoggedin: string
  cguConsentDescriptionLoggedout: string
  cgvConsentTitle: string
  cgvConsentDescription: string
  royaltyDescription: string
  noAssessmentTitle: string
  noAssessmentDescription: string
  oneQuickAssessmentTitle: string
  oneQuickAssessmentDescription: string
  oneAssessmentWithExpertTitle: string
  oneAssessmentWithExpertDescription: string
  oneParticipationAssessmentTitle: string
  oneParticipationAssessmentDescription: string
  addExpertTitle: string
  addExpertDescription: string
  addExpertButtonYes: string
  addExpertButtonNo: string
  mustBeConnectedToCreateTitle: string
  mustBeConnectedToCreateDescription: string
  createQuickAssessmentTitle: string
  createQuickAssessmentDescription: string
  createParticipationAssessmentTitle: string
  createParticipationAssessmentDescription: string
  createAssessmentWithExpertTitle: string
  createAssessmentWithExpertDescription: string
  chooseExpertText: string
  ifNoExpertText: string
  initTitle: string
  initDescription: string
  initiatorNameQuestion: string
  initiatorNameDescription: string
  representativityTitle: string
  representativityDescription: string
  objectiveQuestionsTitle: string
  objectiveQuestionsDescription: string
  initializationValidationTitle: string
  initializationValidationDescription: string
}
export type EvaluationQuestionnairePage = {
  roleQuestionTitle: string
  roleQuestionDescription: string
  endOfProfilingTitle: string
  endOfProfilingDescription: string
  startTitle: string
  startText: string
  intermediateStepTitle: string
  intermediateStepTextLoggedIn: string
  intermediateStepTextLoggedOut: string
  isIntermediateStepTitleWithPillarNames: string
  finishedTitle: string
  finishedTextLoggedIn: string
  finishedTextLoggedOut: string
}

// Props
export type QuestionContextProps = {
  journey: any
  questionById: { [key: number]: Question }
  responseByQuestionId: { [key: number]: QuestionResponse }
  hasPreviousStep: boolean
}

// Settings
export type RgpdSettings = {
  legalMentionUrl: string
  termsOfUseUrl: string
  termsOfSaleUrl: string
  confidentialityPolicyUrl: string
  contentLicenseUrl: string
}

export type StructureSettings = {
  email: string
}
