import { defineStore, mapActions } from "pinia"
import { Criteria, Marker, Pillar, Question } from "~/composables/types"
import { useApiGet } from "~~/composables/api"

export const useQuestionnaireStore = defineStore("questionnaire", {
  state: () => ({
    pillarById: <{ [key: number]: Pillar }>{},
    markerById: <{ [key: number]: Marker }>{},
    criteriaById: <{ [key: number]: Criteria }>{},
    questionById: <{ [key: number]: Question }>{},
  }),
  actions: {
    async loadPillars() {
      const { data, error } = await useApiGet<Pillar[]>(
        "pillars/"
      )
      if (!error.value) {
        for (const pillar of data.value) {
          this.pillarById[pillar.id] = pillar
        }
      }
    },
    async loadMarkers() {
      const { data, error } = await useApiGet<Marker[]>(
        "markers/"
      )
      if (!error.value) {
        for (const marker of data.value) {
          this.markerById[marker.id] = marker
        }
      }
    },
    async loadCriterias() {
      const { data, error } = await useApiGet<Criteria[]>(
        "criterias/"
      )
      if (!error.value) {
        for (const criteria of data.value) {
          this.criteriaById[criteria.id] = criteria
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
    async loadQuestionnaire() {
      await this.loadPillars()
      await this.loadMarkers()
      await this.loadCriterias()
      await this.loadQuestions()
    }
  },
})
