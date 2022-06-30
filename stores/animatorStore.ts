import { defineStore } from "pinia"
import { Participant, QuestionResponse, Workshop } from "~/composables/types"
import { useToastStore } from "./toastStore"

export const useAnimatorStore = defineStore("animator", {
  state: () => ({
    workshopById: <Workshop[]>{},
    allWorkshopsLoaded: <boolean>false,
    // responseByParticipationIdByQuestionnaireQuestionId: <
    //   { [key: number]: { [key: number]: QuestionResponse } }
    //   >{},
    assessmentResponseByQuestionIdByWorkshopId: <
      { [key: number]: { [key: number]: QuestionResponse } }
    >{},
  }),
  getters: {
    workshops: (state) => {
      return Object.values(state.workshopById)
    },
  },
  actions: {
    setWorkshopFromApiToStore(workshop: Workshop) {
      this.workshopById[workshop.id] = workshop
      this.workshopById[workshop.id].changed = false
      this.workshopById[workshop.id].participants.forEach((participant) => {
        participant.changed = false
        participant.responseByQuestionId = {}
        participant.responses.forEach((response) => {
          participant.responseByQuestionId[response.questionId] = response
        })
      })
    },
    async getWorkshops() {
      const { data, error } = await useApiGet<Workshop[]>("workshops/")
      if (!error.value) {
        for (const workshop of data.value) {
          this.setWorkshopFromApiToStore(workshop)
        }
        this.allWorkshopsLoaded = true
      }
    },
    async getWorkshop(workshopId: number) {
      const { data, error } = await useApiGet<Workshop>(
        `workshops/${workshopId}/`
      )
      if (!error.value) {
        this.setWorkshopFromApiToStore(data.value)
      }
    },
    async createOrUpdateWorkshop(workshop: Workshop) {
      const { data, error } = await useApiPost<Workshop>(`workshops/`, workshop)
      if (!error.value) {
        this.workshopById[data.value.id] = data.value
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
        this.workshopById[data.value.id] = data.value
        return data.value
      }
      const errorStore = useToastStore()
      errorStore.setError(error.value.data.messageCode)
      return false
    },
  },
})
