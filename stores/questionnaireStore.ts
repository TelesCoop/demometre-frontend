import { defineStore, mapActions } from "pinia"
import { Criteria, Marker, PillarType, Question } from "~/composables/types"
import { useApiGet } from "~~/composables/api"

type FullMarkers = Marker & { criterias: Criteria[] }
type FullPillar = PillarType & { markers: FullMarkers[] }

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
    pillars: (state) => {
      return Object.values(state.pillarByName)
    }
  },
  actions: {
    async loadQuestionnaireStructure() {
      const { data, error } = await useApiGet<FullPillar[]>(
        "questionnaire-structure/"
      )
      if (!error.value) {
        for (const pillar of data.value) {
          this.pillarByName[pillar.name] = pillar
          for (const marker of pillar.markers) {
            this.markerById[marker.id] = marker
            for (const criteria of marker.criterias) {
              this.criteriaById[criteria.id] = criteria
            }
          }
        }
      }
    },
    async loadQuestions() {
      const { data, error } = await useApiGet<Question[]>(
        "questionnaire-questions/"
      )
      if (!error.value) {
        for (const question of data.value) {
          this.questionById[question.id] = question
        }
      }
    },
  },
})
