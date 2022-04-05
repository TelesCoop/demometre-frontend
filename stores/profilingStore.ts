import { defineStore } from "pinia"
import { Question, Role } from "~/composables/types"
import { useApiGet } from "~~/composables/api"
import { useParticipationStore } from "./participationStore"

export const useProfilingStore = defineStore("profiling", {
  state: () => ({
    roleById: <{ [key: string]: Role }>{},
    questionById: <{ [key: number]: Question }>{},
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
    async loadProfilingQuestions() {
      const { data, error } = await useApiGet<Question[]>(
        `profiling-questions/participation/${useParticipationStore().id}/`
      )
      if (!error.value) {
        for (const question of data.value) {
          this.questionById[question.id] = question
        }
      }
    },
  },
})
