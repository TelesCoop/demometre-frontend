import { defineStore } from "pinia"
import { useApiPatch, useApiPost, useGet } from "~/composables/api"
import {
  Participation,
  PillarName,
  Question,
  QuestionResponse,
} from "~/composables/types"
import { useAssessmentStore } from "./assessmentStore"
import {
  QUESTION_RESPONSE_VALUE_BY_TYPE,
  QUESTION_RESPONSES_BY_TYPE,
} from "~/utils/question-response"
import { useUserStore } from "./userStore"
import { useToastStore } from "./toastStore"
import { useQuestionnaireStore } from "./questionnaireStore"

export const useParticipationStore = defineStore("participation", {
  state: () => ({
    responseByProfilingQuestionId: <{ [key: number]: QuestionResponse }>{},
    responseByQuestionnaireQuestionId: <{ [key: number]: QuestionResponse }>{},
    profilingCurrent: <number[]>[],
    participation: <Participation>{},
    totalAndAnsweredQuestionsByPillarName: <
      { [key: string]: { total: number; answered: number } }
    >{},
  }),
  getters: {
    id() {
      return this.participation?.id
    },
    hasAnsweredQuestionnaireQuestion: (state) => {
      return (questionId: number) =>
        state.responseByQuestionnaireQuestionId[questionId] ? true : false
    },
  },
  actions: {
    // Create participation only one time
    async createParticipation() {
      const userStore = useUserStore()
      // If user not authenticated, create anonymous user
      if (!userStore.isLoggedIn && !userStore.isAnonymous) {
        await userStore.createAnonymousUser()
      }
      const { data, error } = await useApiPost<Participation>(
        `participations/?anonymous=${userStore.anonymousName}`,
        {
          assessmentId: useAssessmentStore().currentAssessmentId,
          roleId: this.participation.roleId,
          consent: this.participation.consent,
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
        const response = await useGet<Participation[]>(
          `participations/?anonymous=${useUserStore().anonymousName}`,
          {
            headers,
          }
        )
        this.participation = response[0] || {}
        if (Object.keys(this.participation).length === 0) {
          return false
        }
        return true
      } catch (e) {
        return false
      }
    },
    setConsent() {
      this.participation.consent = true
    },
    chooseRole(roleId) {
      this.participation.roleId = roleId
    },

    async getProfilingQuestionResponses(
      participationId: number,
      headers = undefined
    ) {
      try {
        const response = await useGet<QuestionResponse[]>(
          `participation-responses/?context=profiling&participation_id=${participationId}&anonymous=${
            useUserStore().anonymousName
          }`,
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
          `participation-responses/?context=questionnaire&participation_id=${participationId}&anonymous=${
            useUserStore().anonymousName
          }`,
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
        `participation-responses/?anonymous=${
          useUserStore().anonymous.username
        }`,
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
        this.setTotalAndAnsweredQuestionsInPillar(question.pillarName)
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
        `participations/${this.id}/questions/completed/?anonymous=${
          useUserStore().anonymous.username
        }`,
        payload
      )
      if (error.value) {
        return false
      }
      this.participation = data.value
      return true
    },
    logoutUser() {
      this.responseByProfilingQuestionId = {}
      this.responseByQuestionnaireQuestionId = {}
      this.profilingCurrent = []
      this.participation = {}
      this.setTotalAndAnsweredQuestionsByPillarName = {}
    },
    setTotalAndAnsweredQuestionsInPillar(pillarName) {
      const questions =
        useQuestionnaireStore().getQuestionnaireQuestionByPillarName(pillarName)
      this.totalAndAnsweredQuestionsByPillarName[pillarName] = {
        total: questions.length,
        answered: questions.reduce(
          (totalAnswered, question: Question) =>
            totalAnswered + this.hasAnsweredQuestionnaireQuestion(question.id),
          0
        ),
      }
    },
    setTotalAndAnsweredQuestionsByPillarName() {
      for (const pillarName in PillarName) {
        this.setTotalAndAnsweredQuestionsInPillar(PillarName[pillarName])
      }
    },
  },
})
