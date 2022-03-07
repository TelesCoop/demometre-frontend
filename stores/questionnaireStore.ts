import { defineStore } from "pinia"
import { Question } from "~/composables/types"
import { useApiGet } from "~~/composables/api"

type QuestionResponse = { items: Question[] }

export const useQuestionnaireStore = defineStore('questionnaire', {
    state: () => ({
        questionById: <{ [key: number]: Question }>{}
    }),
    actions: {
        async loadQuestions() {
            const { data, error } = await useApiGet<QuestionResponse>("cms/questionnaire-questions")
            if (!error.value) {
                for (const question of data.value.items) {
                    this.questionById[question.id] = question
                }
            }
        }
    },
})
