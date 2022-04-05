import { defineStore } from "pinia"
import { useApiPatch, useApiPost } from "~/composables/api"
import { Participation, QuestionResponse } from "~/composables/types"
import { useAssessmentStore } from "./assessmentStore"
import { useProfilingStore } from "./profilingStore"
import { useUserStore } from "./userStore"

export const useParticipationStore = defineStore("participation", {
  state: () => ({
    id: <number | null>null,
    roleId: <number | null>null,
    consent: <boolean>false,
    responseByQuestionIdByPillarName: <
      { [key: string]: { [key: number]: QuestionResponse } }
    >{},
    responseByProfilingQuestionId: <{ [key: number]: QuestionResponse }>{},
    profilingJourney: <number[]>[],
    profilingCurrent: <number[]>[],
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
    nextProfilingQuestionId() {
      // return this.profilingJourney[0]
      return parseInt(Object.keys(useProfilingStore().profilingQuestionById)[0])
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
        `participation/${this.id}/`,
        this.participation
      )
    },
    async getParticipation(participationId: number) {
      const { data, error } = await useApiGet<Participation>(
        `participation/${participationId}/`
      )
      if (!error.value) {
        this.id = data.value.id
        this.roleId = data.value.roleId
        this.consent = data.value.consent
        useAssessmentStore().getAssessment(data.value.assessmentId)
        useProfilingStore().loadProfilingQuestions()
      }
    },
    async getCurrentParticipation() {
      const { data, error } = await useApiGet<Participation[]>(
        `participation/user/${useUserStore().user.id}/`
      )
      if (!error.value) {
        // TODO : manage when several participations retrieve
        const participation = data.value[0]
        this.id = participation.id
        this.roleId = participation.roleId
        this.consent = participation.consent
        useAssessmentStore().getAssessment(participation.assessmentId)
        useProfilingStore().loadProfilingQuestions()
      }
    },
    setConsent() {
      this.consent = true
    },
    chooseRole(roleId) {
      this.roleId = roleId
    },
    setProfilingJourney() {
      // TODO : include drawer question logic
      this.profilingJourney = Object.keys(useProfilingStore())
    },
  },
})
