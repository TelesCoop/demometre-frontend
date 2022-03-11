import { defineStore } from "pinia"
import { Criteria, Marker, Pillar, Question } from "~/composables/types"
import { useApiGet } from "~~/composables/api"

type QuestionResponse = { items: Question[] }

export const useQuestionnaireStore = defineStore("questionnaire", {
  state: () => ({
    pillarById: <{ [key: number]: Pillar }>{},
    markerById: <{ [key: number]: Marker }>{},
    criteriaById: <{ [key: number]: Criteria }>{},
    questionById: <{ [key: number]: Question }>{},
  }),
  actions: {
    async loadQuestions() {
      const { data, error } = await useApiGet<QuestionResponse>(
        "cms/questionnaire-questions/"
      )
      if (!error.value) {
        for (const question of data.value.items) {
          this.questionById[question.id] = question
        }
      }
    },
  },
})
