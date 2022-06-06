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
  }),
  getters: {
    getPillarByName: (state) => {
      return (pillarName) => state.pillarByName[pillarName]
    },
    getPillarNameById: (state) => {
      return (pillarId) =>
        Object.keys(state.pillarByName).find(
          (key) => state.pillarByName[key].id === pillarId
        )
    },
    pillars: (state) => {
      return Object.values(state.pillarByName)
    },
    questions: (state) => {
      return Object.values(state.questionById)
    },
    getQuestionsFromIdList: (state) => {
      return (questionIds: number[]) =>
        Object.values(state.questionById).filter((question: Question) => {
          return questionIds.includes(question.id)
        }) as Question[]
    },
  },
  actions: {
    async getQuestionnaireStructure() {
      const { data, error } = await useApiGet<FullPillar[]>(
        "questionnaire-structure/"
      )
      if (!error.value) {
        this.pillarByName = {}
        this.markerById = {}
        this.criteriaById = {}
        for (const pillar of data.value) {
          this.pillarByName[pillar.name] = pillar
          for (const marker of pillar.markers) {
            this.markerById[marker.id] = marker
            for (const criteria of marker.criterias) {
              this.criteriaById[criteria.id] = criteria
            }
          }
        }
      } else {
        const errorStore = useToastStore()
        errorStore.setError(error.value.data.messageCode)
      }
    },
    async getQuestionnaireQuestions() {
      const { data, error } = await useApiGet<Question[]>(
        `questionnaire-questions/`
      )
      if (error.value) {
        const errorStore = useToastStore()
        errorStore.setError(error.value.data.messageCode)
        return false
      }
      for (const question of data.value) {
        this.questionById[question.id] = question
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
    getQuestionnaireQuestionByPillarName(pillarName): Question[] {
      return Object.values(this.questionById).filter((question: Question) => {
        return pillarName === question.pillarName
      }) as Question[]
    },
  },
})
