import { defineStore } from "pinia"
import { useApiPatch, useApiPost } from "~/composables/api"
import { Participation } from "~/composables/types"
import { useAssessmentStore } from "./assessmentStore"
import { useUserStore } from "./userStore"

export const useParticipationStore = defineStore("participation", {
  state: () => ({
    id: <number | null>null,
    roleId: <number | null>null,
    consent: <boolean>false,
  }),
  getters: {
    participation() {
      return {
        id: this.id,
        roleId: this.roleId,
        consent: this.consent,
        userId: useUserStore().user.id,
        assessmentId: useAssessmentStore().currentAssessmentId,
      }
    },
  },
  actions: {
    async createParticipation() {
      const { data, error } = await useApiPost<Participation>(
        "participation/",
        this.participation
      )
      if (!error.value) {
        this.id = data.value.id
        return true
      }
      return false
    },
    async updateParticipation() {
      const { data, error } = await useApiPatch<Participation>(
        "participation/",
        this.participation
      )
      if (!error.value) {
        this.id = data.value.id
      }
    },
    async getParticipation(participationId: number) {
      // TODO
    },
    setConsent() {
      this.consent = true
    },
    chooseRole(roleId) {
      this.roleId = roleId
    },
    chooseAssessment(assessmentId) {
      this.assessmentId = assessmentId
    },
  },
})
