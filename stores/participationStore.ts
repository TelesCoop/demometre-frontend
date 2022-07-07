import { defineStore } from "pinia"
import { useApiPatch, useApiPost, useGet } from "~/composables/api"
import {
  Objectivity,
  Participation,
  PillarName,
  Question,
  QuestionResponse,
  SurveyType,
} from "~/composables/types"
import { useAssessmentStore } from "./assessmentStore"
import {
  QUESTION_RESPONSES_BY_TYPE,
  getQuestionResponseStructure,
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
      { [key: string]: { total: number; answered: number; completed: boolean } }
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
      if (!userStore.isLoggedIn && !userStore.isUnknownUser) {
        await userStore.createUnknownUser()
      }
      const { data, error } = await useApiPost<Participation>(
        "participations/",
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
        const response = await useGet<Participation[]>("participations/", {
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
          `participation-responses/?context=profiling&participation_id=${participationId}`,
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
      assessmentId: number,
      headers = undefined
    ) {
      try {
        const participationResponses = await useGet<QuestionResponse[]>(
          `participation-responses/?context=questionnaire&participation_id=${participationId}`,
          {
            headers,
          }
        )
        participationResponses.forEach((item) => {
          this.responseByQuestionnaireQuestionId[item.questionId] = item
        })

        const assessmentResponses = await useGet<QuestionResponse[]>(
          `assessment-responses/?assessment_id=${assessmentId}`,
          {
            headers,
          }
        )
        assessmentResponses.forEach((item) => {
          this.responseByQuestionnaireQuestionId[item.questionId] = item
        })
      } catch {
        return false
      }
    },

    async saveResponse(question: Question, response: any, isAnswered: boolean) {
      const questionResponse = getQuestionResponseStructure(
        question,
        response,
        isAnswered,
        this.id,
        useAssessmentStore().currentAssessmentId
      )

      let apiResponse
      if (
        question.objectivity === Objectivity.OBJECTIVE &&
        question.surveyType === SurveyType.QUESTIONNAIRE
      ) {
        apiResponse = await useApiPost<QuestionResponse>(
          `assessment-responses/`,
          questionResponse
        )
      } else {
        apiResponse = await useApiPost<QuestionResponse>(
          "participation-responses/",
          questionResponse
        )
      }
      const { data, error } = apiResponse

      if (error.value) {
        const errorStore = useToastStore()
        errorStore.setError(error.value.data.messageCode)
      }
      if (!error.value && data.value) {
        const questionResponses =
          this[QUESTION_RESPONSES_BY_TYPE[question.surveyType]]
        questionResponses[question.id] = data.value
        if (question.surveyType === SurveyType.QUESTIONNAIRE) {
          this.setTotalAndAnsweredQuestionsInPillar(question.pillarName)
        }
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
      const { data, error } = await useApiPatch<Participation>(
        `participations/${this.id}/questions/completed/`,
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
      this.totalAndAnsweredQuestionsByPillarName = {}
    },
    setTotalAndAnsweredQuestionsInPillar(pillarName) {
      const questions = useQuestionnaireStore().getQuestionsFromIdList(
        useQuestionnaireJourney(pillarName).journey.value
      )
      const answered = questions.reduce(
        (totalAnswered, question: Question) =>
          totalAnswered + this.hasAnsweredQuestionnaireQuestion(question.id),
        0
      )

      this.totalAndAnsweredQuestionsByPillarName[pillarName] = {
        total: questions.length,
        answered: answered,
        completed:
          questions.length === 0 ? true : answered / questions.length === 1,
      }
    },
    setTotalAndAnsweredQuestionsByPillarName() {
      this.totalAndAnsweredQuestionsByPillarName = {}
      for (const pillarName in PillarName) {
        this.setTotalAndAnsweredQuestionsInPillar(PillarName[pillarName])
      }
    },
  },
})
