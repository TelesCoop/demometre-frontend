import { defineStore } from "pinia"
import { Criteria, Marker, PillarType, Question } from "~/composables/types"
import { useToastStore } from "./toastStore"
import { useApiGet } from "~/composables/api"

type FullMarkers = Marker & { criterias: Criteria[] }
type FullPillar = PillarType & { markers: FullMarkers[] }
type HierarchicalQuestionStructure = {
  criteriaId: number
  markerId: number
  pillarId: number
  pillarName: string
}
export const useQuestionnaireStore = defineStore("questionnaire", {
  state: () => ({
    pillarByName: <{ [key: string]: PillarType }>{},
    markerById: <{ [key: number]: Marker }>{},
    criteriaById: <{ [key: number]: Criteria }>{},
    questionById: <{ [key: number]: Question }>{},
    orderedQuestionIds: <number[]>[],
  }),
  getters: {
    getPillarByName(this) {
      return (pillarName) => this.pillarByName[pillarName]
    },

    pillars() {
      return Object.values(this.pillarByName)
    },
    questions() {
      return this.orderedQuestionIds.map(
        (questionId) => this.questionById[questionId]
      )
    },
    getQuestionsFromIdList() {
      return (questionIds: number[]) =>
        Object.values(this.questionById).filter((question: Question) => {
          return questionIds.includes(question.id)
        }) as Question[]
    },
    getQuestionnaireQuestionByPillarName() {
      return (pillarName): Question[] => {
        return this.questions.filter((question: Question) => {
          return pillarName === question.pillarName
        }) as Question[]
      }
    },
  },
  actions: {
    getPillarNameById(pillarId) {
      return Object.keys(this.pillarByName).find(
        (key) => this.pillarByName[key].id === pillarId
      )
    },
    async getQuestionnaireStructure() {
      const { data, error } = await useApiGet<FullPillar[]>(
        "questionnaire-structure/"
      )
      if (!error.value) {
        console.log("### got questionnaire structure")
        this.pillarByName = {}
        this.markerById = {}
        this.criteriaById = {}
        for (const pillar of data.value) {
          this.pillarByName[pillar.name] = pillar
          for (const marker of pillar.markers) {
            this.markerById[marker.id] = marker
            for (const criteria of marker.criterias) {
              this.criteriaById[criteria.id] = criteria
              this.criteriaById[criteria.id].explanatory = JSON.parse(
                criteria.explanatory as string
              ).map((obj) => obj.value)
            }
          }
        }
      } else {
        const errorStore = useToastStore()
        errorStore.setError(error.value.data?.messageCode)
      }
    },
    async getQuestionnaireQuestions() {
      const { data, error } = await useApiGet<Question[]>(
        `questionnaire-questions/`
      )
      if (error.value) {
        const errorStore = useToastStore()
        errorStore.setError(error.value.data?.messageCode)
        return false
      }
      this.orderedQuestionIds = []

      for (const question of data.value) {
        this.questionById[question.id] = question
        this.orderedQuestionIds.push(question.id)
      }
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
      const hierarchicalQuestionStructure: HierarchicalQuestionStructure = {
        criteriaId: criteria.id,
        markerId: marker.id,
        pillarId: marker.pillarId,
        pillarName: marker.pillarName,
      }
      return hierarchicalQuestionStructure
    },
  },
})
