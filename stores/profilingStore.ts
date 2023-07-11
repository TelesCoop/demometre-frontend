import { defineStore } from "pinia"
import { Question, Role } from "~/composables/types"
import { useErrorStore } from "./toastStore"
import { useApiGet } from "~~/composables/api"

export const useProfilingStore = defineStore("profiling", {
  state: () => ({
    roleById: <{ [key: string]: Role }>{},
    questionById: <{ [key: number]: Question }>{},
    orderedQuestionId: <number[]>[],
  }),
  getters: {
    roles: (state) => {
      return Object.values(state.roleById)
    },
  },
  actions: {
    async getRoles() {
      const { data, error } = await useApiGet<Role[]>("roles/")
      if (!error.value) {
        for (const role of data.value) {
          this.roleById[role.id] = role
        }
      } else {
        const errorStore = useErrorStore()
        errorStore.setError(error.value.data?.messageCode)
      }
    },
    async getProfilingQuestions() {
      const { data, error } = await useApiGet<Question[]>(
        `profiling-questions/`
      )
      if (error.value) {
        return false
      }
      this.orderedQuestionId = []
      for (const question of data.value) {
        this.questionById[question.id] = question
        this.orderedQuestionId.push(question.id)
      }
      return true
    },
  },
})
