import { defineStore } from "pinia"
import { Question, Role } from "~/composables/types"
import { useApiGet, useGet } from "~~/composables/api"
import { useParticipationStore } from "./participationStore"

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
    async loadRoles() {
      const { data, error } = await useApiGet<Role[]>("roles/")
      if (!error.value) {
        for (const role of data.value) {
          this.roleById[role.id] = role
        }
      }
    },
    async getProfilingQuestions(participationId, headers = undefined) {
      try {
        const response = await useGet<Question[]>(
          `profiling-questions/participation/${participationId}/`,
          { headers }
        )
        this.orderedQuestionId = []
        for (const question of response) {
          this.questionById[question.id] = question
          this.orderedQuestionId.push(question.id)
        }

        return true
      } catch {
        return false
      }
    },
  },
})
