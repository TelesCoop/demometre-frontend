import { defineStore } from "pinia"
import { useApiPatch, useApiPost, useGet } from "~/composables/api"
import { Participation, Question, QuestionResponse } from "~/composables/types"
import { useAssessmentStore } from "./assessmentStore"
import {
  QUESTION_RESPONSE_VALUE_BY_TYPE,
  QUESTION_RESPONSES_BY_TYPE,
} from "~/utils/question-response"
import { useUserStore } from "./userStore"
import { useToastStore } from "./toastStore"

export const useParticipationStore = defineStore("participation", {
  state: () => ({
    roleId: <number | null>null,
    consent: <boolean>false,
    responseByProfilingQuestionId: <{ [key: number]: QuestionResponse }>{},
    responseByQuestionnaireQuestionId: <{ [key: number]: QuestionResponse }>{},
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
      const userStore = useUserStore()
      // If user not authenticated, create anonymous user
      if (!userStore.isLoggedIn) {
        userStore.createAnonymousUser()
      }
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
      const errorStore = useToastStore()
      errorStore.setError(error.value.data.messageCode)
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

    async getQuestionnaireQuestionResponses(
      participationId: number,
      headers = undefined
    ) {
      try {
        const response = await useGet<QuestionResponse[]>(
          `responses/?context=questionnaire&participation_id=${participationId}`,
          {
            headers,
          }
        )
        response.forEach((item) => {
          this.responseByQuestionnaireQuestionId[item.questionId] = item
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

      if (isAnswered) {
        const questionValue = QUESTION_RESPONSE_VALUE_BY_TYPE[question.type]
        questionResponse[questionValue] = response
      }

      const { data, error } = await useApiPost<QuestionResponse>(
        "responses/",
        questionResponse
      )
      if (error.value) {
        const errorStore = useToastStore()
        errorStore.setError(error.value.data.messageCode)
      }
      if (!error.value && data.value) {
        const questionResponses =
          this[QUESTION_RESPONSES_BY_TYPE[question.surveyType]]
        questionResponses[question.id] = data.value
        return true
      }
      return false
    },

    async saveEndQuestionnaire(
      isProfilingQuestion: boolean,
      pillarId?: number
    ) {
      const payload = {
        profilingQuestion: isProfilingQuestion,
        pillarId: pillarId,
      }
      const { data, error } = await useApiPatch<QuestionResponse>(
        `participations/${this.id}/questions/completed/`,
        payload
      )
      if (error.value) {
        return false
      }
      this.participation = data.value
      return true
    },
  },
})
