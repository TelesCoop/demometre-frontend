import { defineStore } from "pinia"
import { Criteria, Marker, PillarType, Question, Survey } from "~/composables/types"
import { useMessageStore } from "./messageStore"
import { useApiGet } from "~/composables/api"

type HierarchicalQuestionStructure = {
  criteriaId: number
  markerId: number
  pillarId: number
  pillarName: string
  surveyName: string
}
export const useQuestionnaireStore = defineStore("questionnaire", {
  state: () => ({
    criteriaById: <{ [key: number]: Criteria }>{},
    isSurveyLoading: false,
    markerById: <{ [key: number]: Marker }>{},
    orderedQuestionIds: <number[]>[],
    pillarById: <{ [key: string]: PillarType }>{},
    questionById: <{ [key: number]: Question }>{},
    surveyById: <{ [key: number]: Survey }>{},
  }),
  getters: {
    getPillarByName(this) {
      return (pillarName: string) => Object.values(this.pillarById).find(
        (pillar) => pillar.name === pillarName,
      )
    },
    pillars(): PillarType[] {
      return Object.values(this.pillarById)
    },
    questionsForSurvey() {
      return (surveyId: number): Question[] => {
        return this.surveyById[surveyId].questions.map(
          (questionId) => this.questionById[questionId],
        )
      }
    },
    getQuestionsFromIdList() {
      return (questionIds: number[]) =>
        Object.values(this.questionById).filter((question: Question) => {
          return questionIds.includes(question.id)
        }) as Question[]
    },
    getQuestionnaireQuestionByPillarName() {
      return (surveyId: number, pillarName: string): Question[] => {
        return this.questionsForSurvey(surveyId).filter((question: Question) => {
          return pillarName === question.pillarName
        }) as Question[]
      }
    },
  },
  actions: {
    getPillarNameById(pillarId: number) {
      return this.pillarById[pillarId].name
    },
    async getSurvey(surveyId: number) {
      const { data, error } = await useApiGet<Survey[]>(
        `surveys/${surveyId}/`, "", `survey-${surveyId}`,
      )
      if (!error.value) {
        const survey: Survey = data.value!
        for (const pillar of survey.pillars) {
          this.pillarById[pillar.id] = pillar
          for (const marker of pillar.markers) {
            this.markerById[marker.id] = marker
            for (const criteria of marker.criterias) {
              this.criteriaById[criteria.id] = criteria
            }
          }
        }
        this.surveyById[survey.id] = survey

      } else {
        const errorStore = useMessageStore()
        errorStore.setError(error.value.data?.messageCode)
      }
    },
    async getSurveys() {
      const { data, error } = await useApiGet<Survey[]>(
        "surveys/",
      )
      if (!error.value) {
        this.surveyById = {}
        this.pillarById = {}
        this.markerById = {}
        this.criteriaById = {}
        for (const survey of data.value) {
          for (const pillar of survey.pillars) {
            this.pillarById[pillar.id] = pillar
            for (const marker of pillar.markers) {
              this.markerById[marker.id] = marker
              for (const criteria of marker.criterias) {
                this.criteriaById[criteria.id] = criteria
              }
            }
          }
          this.surveyById[survey.id] = survey
        }
        console.log("### got surveys")
        await this.getQuestionnaireQuestions()
        console.log("### got questions")
      } else {
        const errorStore = useMessageStore()
        errorStore.setError(error.value.data?.messageCode)
      }
    },
    async getQuestionnaireQuestions() {
      const { data, error } = await useApiGet<Question[]>(
        `questionnaire-questions/`,
      )
      if (error.value) {
        const errorStore = useMessageStore()
        errorStore.setError(error.value.data?.messageCode)
        return false
      }
      for (const surveyId of Object.keys(this.surveyById)) {
        this.surveyById[+surveyId].questions = []
      }

      for (const question of data.value!) {
        this.questionById[question.id] = question
        this.surveyById[question.surveyId].questions.push(question.id)
      }
      return true
    },
    async getQuestionsForSurvey(surveyId: number) {
      const { data, error } = await useApiGet<Question[]>(
        `surveys/${surveyId}/questions/`,
      )
      if (error.value) {
        const errorStore = useMessageStore()
        errorStore.setError(error.value.data?.messageCode)
        return false
      }
      const orderedQuestionIds = []

      for (const question of data.value!) {
        this.questionById[question.id] = question
        orderedQuestionIds.push(question.id)
      }
      this.surveyById[surveyId].questions = orderedQuestionIds
      return true
    },
    getHierarchicalQuestionStructure({
      question,
      questionId,
    }: {
      question?: Question
      questionId?: number
    }): HierarchicalQuestionStructure | undefined {
      const currentQuestion = question || this.questionById[questionId]

      if (!currentQuestion.criteriaId) {
        return
      }

      const criteria = this.criteriaById[currentQuestion.criteriaId]
      const marker = this.markerById[criteria.markerId]
      const pillar = this.pillarById[marker.pillarId]
      const survey = this.surveyById[pillar.surveyId]
      return {
        criteriaId: criteria.id,
        markerId: marker.id,
        pillarId: marker.pillarId,
        pillarName: marker.pillarName,
        surveyName: survey.name,
        surveyId: survey.id,
      }
    },
  },
})
