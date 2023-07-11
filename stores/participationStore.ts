import { defineStore } from "pinia"
import { useApiGet, useApiPatch, useApiPost } from "~/composables/api"
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
import { useErrorStore } from "./toastStore"
import { useQuestionnaireStore } from "./questionnaireStore"

export const useParticipationStore = defineStore("participation", {
  state: () => ({
    responseByProfilingQuestionId: <{ [key: number]: QuestionResponse }>{},
    responseByQuestionnaireQuestionId: <{ [key: number]: QuestionResponse }>{},
    profilingCurrent: <number[]>[],
    participations: <{ [key: number]: Participation }>{},
    newParticipation: <Participation>{},
    currentParticipationId: <number>undefined,
    totalAndAnsweredQuestionsByPillarName: <
      { [key: string]: { total: number; answered: number; completed: boolean } }
    >{},
    showCancelParticipationModal: <boolean>false,
    showSaveParticipationModal: <boolean>false,
  }),
  getters: {
    participation() {
      return this.participations?.[this.currentParticipationId] || {}
    },
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
          roleId: this.newParticipation.roleId,
          consent: this.newParticipation.consent,
        }
      )
      if (!error.value) {
        this.currentParticipationId = data.value.id
        this.participations[this.currentParticipationId] = data.value
        return true
      }
      const errorStore = useErrorStore()
      errorStore.setError(error.value.data?.messageCode)
      return false
    },
    async getCurrentParticipation(): Promise<boolean> {
      const response = await useApiGet<Participation>("participations/current/")
      if (response.error.value) {
        return false
      }
      if (response.data.value?.id) {
        this.currentParticipationId = response.data.value.id
        this.participations[this.currentParticipationId] = response.data.value
      }

      return true
    },
    async getParticipations(): Promise<boolean> {
      const response = await useApiGet<Participation[]>("participations")
      if (response.error.value) {
        const errorStore = useErrorStore()
        errorStore.setError(response.error.value.data?.messageCode)
        return false
      }
      this.participations = response.data.value

      return true
    },
    chooseRole(roleId) {
      this.newParticipation.roleId = roleId
    },

    async getCurrentProfilingQuestionResponses() {
      const response = await useApiGet<QuestionResponse[]>(
        `participation-responses/current/?context=profiling`
      )
      if (response.error.value) {
        return false
      }

      response.data.value.forEach((item) => {
        this.responseByProfilingQuestionId[item.questionId] = item
      })
      return true
    },

    async getCurrentQuestionnaireSubjectiveQuestionResponses() {
      const participationResponses = await useApiGet<QuestionResponse[]>(
        `participation-responses/current/?context=questionnaire`
      )
      if (participationResponses.error.value) {
        return false
      }
      participationResponses.data.value.forEach((item) => {
        this.responseByQuestionnaireQuestionId[item.questionId] = item
      })
      return true
    },
    async getCurrentQuestionnaireObjectiveQuestionResponses() {
      const assessmentResponses = await useApiGet<QuestionResponse[]>(
        `assessment-responses/current/`
      )
      if (assessmentResponses.error.value) {
        return false
      }
      assessmentResponses.data.value.forEach((item) => {
        this.responseByQuestionnaireQuestionId[item.questionId] = item
      })
      return true
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
        const errorStore = useErrorStore()
        errorStore.setError(error.value.data?.messageCode)
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
      this.participations[this.currentParticipationId] = data.value
      return true
    },
    logoutUser() {
      this.responseByProfilingQuestionId = {}
      this.responseByQuestionnaireQuestionId = {}
      this.profilingCurrent = []
      this.participations = {}
      this.newParticipation = {}
      this.currentParticipationId = undefined
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
    setShowCancelParticipationModal(show) {
      this.showCancelParticipationModal = show
    },
    setShowSaveParticipationModal(show) {
      this.showSaveParticipationModal = show
    },
  },
})
