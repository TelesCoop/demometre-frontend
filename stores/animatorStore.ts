import { defineStore } from "pinia"
import {
  Assessment,
  Objectivity,
  Participant,
  Question,
  QuestionResponse,
  Workshop,
} from "~/composables/types"
import { useAssessmentStore } from "./assessmentStore"
import { useToastStore } from "./toastStore"

type FullWorkshop = Workshop & {
  participants: Participant[]
  assessmentResponses: QuestionResponse[]
}

export const useAnimatorStore = defineStore("animator", {
  state: () => ({
    assessmentIds: <number[]>[],
    allAssessmentsLoaded: <boolean>false,
    workshopById: <{ [key: number]: Workshop }>{},
    allWorkshopsLoaded: <boolean>false,
    participantById: <{ [key: number]: Participant }>{},
    assessmentResponseByQuestionIdByWorkshopId: <
      { [key: number]: { [key: number]: QuestionResponse } }
    >{},
  }),
  getters: {
    assessments: (state) => {
      return state.assessmentIds.map(
        (assessmentId) => useAssessmentStore().assessmentById[assessmentId]
      )
    },
    workshops: (state) => {
      return Object.values(state.workshopById)
    },
    workshopParticipants: (state) => {
      return (workshopId) => {
        return state.workshopById[workshopId].participantIds.map(
          (participantId) => state.participantById[participantId]
        )
      }
    },
  },
  actions: {
    setParticipantFromApiToStore(participant: Participant) {
      participant.changed = false
      participant.responseByQuestionId = {}
      participant.responses.forEach((response) => {
        participant.responseByQuestionId[response.questionId] = response
      })
      this.participantById[participant.id] = participant
    },
    setFullWorkshopFromApiToStore(workshop: FullWorkshop) {
      this.workshopById[workshop.id] = workshop
      this.workshopById[workshop.id].changed = false
      workshop.participants.forEach((participant) => {
        this.setParticipantFromApiToStore(participant)
      })
      this.assessmentResponseByQuestionIdByWorkshopId[workshop.id] = {}
      workshop.assessmentResponses.forEach((response) => {
        this.assessmentResponseByQuestionIdByWorkshopId[workshop.id][
          response.questionId
        ] = response
      })
    },
    async getAnimatorAssessments() {
      const { data, error } = await useApiGet<Assessment[]>(
        "assessments/by-animator/"
      )
      if (!error.value) {
        for (const assessment of data.value) {
          if (!this.assessmentIds.includes(assessment.id)) {
            this.assessmentIds.push(assessment.id)
          }
          useAssessmentStore().addAssessment(assessment)
        }
        this.allAssessmentsLoaded = true
      } else {
        const errorStore = useToastStore()
        errorStore.setError(error.value.data?.messageCode)
      }
    },
    async getWorkshops() {
      const { data, error } = await useApiGet<Workshop[]>("workshops/")
      if (!error.value) {
        for (const workshop of data.value) {
          this.workshopById[workshop.id] = workshop
          this.workshopById[workshop.id].changed = false
        }
        this.allWorkshopsLoaded = true
      }
    },
    async getWorkshop(workshopId: number) {
      const { data, error } = await useApiGet<FullWorkshop>(
        `full-workshops/${workshopId}/`
      )
      if (!error.value) {
        this.setFullWorkshopFromApiToStore(data.value)
      }
    },
    async createOrUpdateWorkshop(workshop: Workshop) {
      const { data, error } = await useApiPost<Workshop>(`workshops/`, workshop)
      if (!error.value) {
        this.workshopById[data.value.id] = data.value
        this.workshopById[data.value.id].changed = false
        return data.value
      }
      const errorStore = useToastStore()
      errorStore.setError(error.value.data.messageCode)
      return false
    },
    async createOrUpdateParticipant(
      participant: Participant,
      workshopId: number
    ) {
      participant.responses = Object.values(
        JSON.parse(JSON.stringify(participant.responseByQuestionId))
      )
      const toastStore = useToastStore()
      const { data, error } = await useApiPost<Participant>(
        `workshops/${workshopId}/participant/`,
        { ...participant, workshopId: workshopId }
      )
      if (!error.value) {
        this.setParticipantFromApiToStore(data.value)
        if (
          !this.workshopById[workshopId].participantIds.includes(data.value.id)
        ) {
          this.workshopById[workshopId].participantIds.push(data.value.id)
        }
        toastStore.setInfo("Sauvegarde réussie")
        return data.value
      }

      toastStore.setError(error.value.data.messageCode)
      return false
    },
    async createOrUpdateQuestionnaireResponses(
      workshopId: number,
      question: Question
    ) {
      let apiResponse
      if (question.objectivity === Objectivity.OBJECTIVE) {
        apiResponse = await useApiPost<QuestionResponse>(
          `assessment-responses/`,
          this.assessmentResponseByQuestionIdByWorkshopId[workshopId][
            question.id
          ]
        )
      } else {
        for (const participantId of this.workshopById[workshopId]
          .participantIds) {
          apiResponse = await useApiPost<QuestionResponse>(
            `workshops/${workshopId}/participant/${participantId}/response`,
            this.participantById[participantId].responseByQuestionId[
              question.id
            ]
          )
        }
      }
      const { data, error } = apiResponse
      const toastStore = useToastStore()

      if (error.value) {
        toastStore.setError(error.value.data.messageCode)
      }
      if (!error.value && data.value) {
        toastStore.setInfo("Sauvegarde réussie")
        return true
      }
      return false
    },
  },
})
