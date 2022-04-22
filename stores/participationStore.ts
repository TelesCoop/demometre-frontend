import { defineStore } from "pinia"
import { useApiPatch, useApiPost } from "~/composables/api"
import { Participation, Question, QuestionResponse } from "~/composables/types"
import { useAssessmentStore } from "./assessmentStore"
import { useProfilingStore } from "./profilingStore"
import { useUserStore } from "./userStore"
import {
  QUESTION_RESPONSE_VALUE_BY_TYPE,
  QUESTION_RESPONSES_BY_TYPE,
} from "~/assets/utils/question-response"

export const useParticipationStore = defineStore("participation", {
  state: () => ({
    id: <number | null>null,
    roleId: <number | null>null,
    consent: <boolean>false,
    responseByQuestionnaireQuestionId: <{ [key: number]: QuestionResponse }>{},
    responseByProfilingQuestionId: <{ [key: number]: QuestionResponse }>{},
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
  },
  actions: {
    async createParticipation() {
      const { data, error } = await useApiPost<Participation>(
        "participations/",
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
        `participations/${this.id}/`,
        this.participation
      )
    },
    async getParticipation(participationId: number) {
      const { data, error } = await useApiGet<Participation>(
        `participations/${participationId}/`
      )
      if (!error.value) {
        this.updateState(data.value)
      }
    },
    async getCurrentParticipation() {
      const { data, error } = await useApiGet<Participation[]>(
        `participations/`
      )
      console.log("get participation", data.value)

      if (!error.value && data.value) {
        // TODO : manage when several participations retrieve
        this.updateState(data.value[0])
      }
    },
    async updateState(participation) {
      this.id = participation.id
      this.roleId = participation.roleId
      this.consent = participation.consent
    },
    setConsent() {
      this.consent = true
    },
    chooseRole(roleId) {
      this.roleId = roleId
    },
    setProfilingJourney() {
      // TODO : include drawer question logic
      this.profilingJourney = Object.keys(useProfilingStore().questionById)
    },

    async getProfilingQuestionResponses(participationId: number) {
      const { data, error } = await useApiGet<QuestionResponse[]>(
        `responses/?context=profiling&participation_id=${participationId}`
      )
      if (!error.value) {
        data.value.forEach((response) => {
          this.responseByProfilingQuestionId[response.questionId] = response
        })
        return true
      }
      return false
    },

    async saveResponse(question: Question, response: any) {
      const questionResponse = {
        questionId: question.id,
        participationId: this.id,
      } as QuestionResponse

      const questionValue = QUESTION_RESPONSE_VALUE_BY_TYPE[question.type]
      questionResponse[questionValue] = response

      const { data, error } = await useApiPost<QuestionResponse>(
        "responses/",
        questionResponse
      )
      if (!error.value && data.value) {
        const questionResponses =
          this[QUESTION_RESPONSES_BY_TYPE[question.surveyType]]
        questionResponses[question.id] = data.value
        return true
      }
      return false
    },
  },
})
