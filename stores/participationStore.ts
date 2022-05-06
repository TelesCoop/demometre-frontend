import { defineStore } from "pinia"
import { useApiPost, useGet } from "~/composables/api"
import { Participation, Question, QuestionResponse } from "~/composables/types"
import { useAssessmentStore } from "./assessmentStore"
import {
  QUESTION_RESPONSE_VALUE_BY_TYPE,
  QUESTION_RESPONSES_BY_TYPE,
} from "~/assets/utils/question-response"

export const useParticipationStore = defineStore("participation", {
  state: () => ({
    roleId: <number | null>null,
    consent: <boolean>false,
    responseByQuestionnaireQuestionId: <{ [key: number]: QuestionResponse }>{},
    responseByProfilingQuestionId: <{ [key: number]: QuestionResponse }>{},
    profilingCurrent: <number[]>[],
    participation: <Participation>{},
  }),
  getters: {
    id() {
      return this.participation?.id
    },
  },
  actions: {
    // Create participation only one time
    async createParticipation() {
      const { data, error } = await useApiPost<Participation>(
        "participations/",
        {
          assessmentId: useAssessmentStore().currentAssessmentId,
          roleId: this.roleId,
          consent: this.consent,
        }
      )
      if (!error.value) {
        this.participation = data.value
        return true
      }
      return false
    },
    async getCurrentParticipation(headers = undefined) {
      try {
        const response = await useGet<Participation[]>(`participations/`, {
          headers,
        })
        this.participation = response[0] || {}
        if (Object.keys(this.participation).length === 0) {
          return false
        }
        return true
      } catch (e) {
        return false
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

    async getProfilingQuestionResponses(
      participationId: number,
      headers = undefined
    ) {
      try {
        const response = await useGet<QuestionResponse[]>(
          `responses/?context=profiling&participation_id=${participationId}`,
          {
            headers,
          }
        )
        response.forEach((item) => {
          this.responseByProfilingQuestionId[item.questionId] = item
        })
      } catch {
        return false
      }
    },

    async saveResponse(question: Question, response: any, isAnswered: boolean) {
      const questionResponse = {
        questionId: question.id,
        participationId: this.id,
        hasPassed: !isAnswered,
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
