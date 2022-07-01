import { defineStore } from "pinia"
import { Participant, QuestionResponse, Workshop } from "~/composables/types"
import { useToastStore } from "./toastStore"

type FullWorkshop = Workshop & {
  participants: Participant[]
  assessmentResponseByQuestionId: { [key: number]: QuestionResponse }
}

export const useAnimatorStore = defineStore("animator", {
  state: () => ({
    workshopById: <{ [key: number]: Workshop }>{},
    allWorkshopsLoaded: <boolean>false,
    participantById: <{ [key: number]: Participant }>{},
    assessmentResponseByQuestionIdByWorkshopId: <
      { [key: number]: { [key: number]: QuestionResponse } }
    >{},
  }),
  getters: {
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
    setWorkshopFromApiToStore(workshop: Workshop) {
      this.workshopById[workshop.id] = workshop
      this.workshopById[workshop.id].changed = false
      this.workshopById[workshop.id].participants.forEach((participant) => {
        this.setParticipantFromApiToStore(participant)
      })
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
        this.setWorkshopFromApiToStore(data.value)
        this.getAssessmentResponses(data.value)
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

        return data.value
      }
      const errorStore = useToastStore()
      errorStore.setError(error.value.data.messageCode)
      return false
    },
    async getAssessmentResponses(workshop: Workshop) {
      this.assessmentResponseByQuestionIdByWorkshopId[workshop.id] = {}
      const { data, error } = await useApiGet<QuestionResponse[]>(
        `assessment-responses/?assessment_id=${workshop.assessmentId}`
      )
      if (!error.value) {
        for (const assessmentResponse of data.value) {
          this.assessmentResponseByQuestionIdByWorkshopId[workshop.id][
            assessmentResponse.questionId
          ] = assessmentResponse
        }
      }
    },
  },
})
