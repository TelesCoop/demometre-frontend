import { defineStore } from "pinia"
import { Assessment, RepresentativityCriteria } from "~/composables/types"
import { useApiGet, useApiPost } from "~/composables/api"
import { useToastStore } from "./toastStore"
import { useUserStore } from "./userStore"

export const useAssessmentStore = defineStore("assessment", {
  state: () => ({
    assessmentById: <{ [key: number]: Assessment }>{},
    currentAssessmentId: <number>undefined,
    representativityCriterias: <RepresentativityCriteria[]>[],
  }),
  getters: {
    assessments() {
      return Object.values(this.assessmentById)
    },
    municipalityAssessments() {
      return this.assessments.find(
        (assessment: Assessment) => assessment.localityType === "municipality"
      )
    },
    intercommunalityAssessments() {
      return this.assessments.find(
        (assessment: Assessment) =>
          assessment.localityType === "intercommunality"
      )
    },
    currentAssessment() {
      return this.assessmentById[this.currentAssessmentId]
    },
    userIsAssessmentAdmin() {
      return (
        this.currentAssessment.initiatedByUser?.id === useUserStore().user.id
      )
      // TODO : check if current user is assessment expert
    },
    participationBoardTitle() {
      return (
        "Tableau de bord de " +
        (this.currentAssessment?.municipality
          ? "ma ville"
          : "mon inter-communalité")
      )
    },
  },
  actions: {
    async getOrCreateAssessment({ zipCode, localityType }) {
      const { data, error } = await useApiGet<Assessment>(
        `assessments/by-locality/?zip_code=${zipCode}&locality_type=${localityType}`
      )
      if (error.value) {
        const errorStore = useToastStore()
        errorStore.setError(error.value.data.messageCode)
        return false
      }
      this.assessmentById[data.value.id] = data.value
      this.currentAssessmentId = data.value.id
      return true
    },

    async getCurrentAssessment() {
      const response = await useApiGet<Assessment>(`assessments/current`)

      if (response.error.value) {
        return false
      }

      this.assessmentById[response.data.value.id] = response.data.value
      this.currentAssessmentId = response.data.value.id
      return true
    },

    async getAssessment(id) {
      const response = await useApiGet<Assessment>(`assessments/${id}/`)

      if (response.error.value) {
        const errorStore = useToastStore()
        errorStore.setError(response.error.value.data.messageCode)
        return false
      }

      this.assessmentById[response.data.value.id] = response.data.value
      this.currentAssessmentId = response.data.value.id
      return true
    },
    async getRepresentativityCriterias() {
      const { data, error } = await useApiGet<RepresentativityCriteria>(
        "representativity-criterias/"
      )
      if (!error.value) {
        this.representativityCriterias = data.value
      } else {
        const errorStore = useToastStore()
        errorStore.setError(error.value.data.messageCode)
      }
    },
    async initializeAssessment(payload) {
      const { data, error } = await useApiPost<Assessment>(
        `assessments/${this.currentAssessmentId}/initialization/`,
        {
          representativityThresholds: this.representativityCriterias.map(
            (item) => {
              return { id: item.id, value: item.acceptabilityThreshold }
            }
          ),
          ...payload,
        }
      )
      if (error.value) {
        const errorStore = useToastStore()
        errorStore.setError(error.value.data.messageCode)
        return false
      }
      this.assessmentById[data.value.id] = data.value
      return true
    },
    async saveEndInitializationQuestions() {
      const { data, error } = await useApiPatch<Assessment>(
        `assessments/${this.currentAssessmentId}/questions/completed/`
      )
      if (error.value) {
        return false
      }
      this.assessmentById[this.currentAssessmentId] = data.value
      return true
    },
    logoutUser() {
      this.currentAssessmentId = undefined
      this.assessmentById = {}
    },
  },
})
