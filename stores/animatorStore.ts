import { defineStore } from "pinia"
import {
  Assessment,
  Objectivity,
  Question,
  QuestionResponse,
  Workshop,
  WorkshopParticipation,
} from "~/composables/types"
import { useAssessmentStore } from "./assessmentStore"
import { useToastStore } from "./toastStore"

type FullWorkshop = Workshop & {
  participations: WorkshopParticipation[]
  assessmentResponses: QuestionResponse[]
}

export const useAnimatorStore = defineStore("animator", {
  state: () => ({
    assessmentIds: <number[]>[],
    allAssessmentsLoaded: <boolean>false,
    workshopById: <{ [key: number]: Workshop }>{},
    allWorkshopsLoaded: <boolean>false,
    participationById: <{ [key: number]: WorkshopParticipation }>{},
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
    workshopParticipations: (state) => {
      return (workshopId) => {
        return state.workshopById[workshopId].participationIds.map(
          (participationId) => state.participationById[participationId]
        )
      }
    },
  },
  actions: {
    setParticipationtFromApiToStore(participation: WorkshopParticipation) {
      participation.changed = false
      participation.responseByQuestionId = {}
      participation.responses.forEach((response) => {
        participation.responseByQuestionId[response.questionId] = response
      })
      this.participationById[participation.id] = participation
    },
    setFullWorkshopFromApiToStore(workshop: FullWorkshop) {
      this.workshopById[workshop.id] = workshop
      this.workshopById[workshop.id].changed = false
      workshop.participations.forEach((participation) => {
        this.setParticipationtFromApiToStore(participation)
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
    async createOrUpdateParticipation(
      participation: WorkshopParticipation,
      workshopId: number
    ) {
      participation.responses = Object.values(
        JSON.parse(JSON.stringify(participation.responseByQuestionId))
      )
      const toastStore = useToastStore()
      const { data, error } = await useApiPost<WorkshopParticipation>(
        `workshops/${workshopId}/participation/`,
        { ...participation, workshopId: workshopId }
      )
      if (!error.value) {
        this.setParticipationtFromApiToStore(data.value)
        if (
          !this.workshopById[workshopId].participationIds.includes(
            data.value.id
          )
        ) {
          this.workshopById[workshopId].participationIds.push(data.value.id)
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
      let errorOccured = false
      if (question.objectivity === Objectivity.OBJECTIVE) {
        const apiResponse = await useApiPost<QuestionResponse>(
          `assessment-responses/`,
          this.assessmentResponseByQuestionIdByWorkshopId[workshopId][
            question.id
          ]
        )
        if (apiResponse.error.value) {
          errorOccured = true
        }
      } else {
        for (const participationId of this.workshopById[workshopId]
          .participationIds) {
          const response =
            this.participationById[participationId].responseByQuestionId[
              question.id
            ]

          if (response && Object.entries(response).length !== 0) {
            const apiResponse = await useApiPost<QuestionResponse>(
              `workshops/${workshopId}/participation/${participationId}/response/`,
              response
            )
            if (apiResponse.error.value) {
              errorOccured = true
            }
          }
        }
      }
      const toastStore = useToastStore()

      if (errorOccured) {
        toastStore.setError("Une erreur s'est produite lors de la sauvegarde")
        return false
      }
      toastStore.setInfo("Sauvegarde réussie")
      return true
    },
    async closeWorkshop(workshopId: number) {
      const { data, error } = await useApiPatch<Workshop>(
        `workshops/${workshopId}/closed/`
      )
      const toastStore = useToastStore()
      if (error.value) {
        toastStore.setError(error.value.data.messageCode)
        return false
      }
      const workshop = data.value
      this.workshopById[workshop.id] = workshop
      this.workshopById[workshop.id].changed = false
      return true
    },
  },
})
