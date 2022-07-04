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
    assessments: (state) => {
      return Object.values(state.assessmentById)
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

    async getAssessment(id, headers = undefined) {
      try {
        const response = await useGet<Assessment>(`assessments/${id}/`, {
          headers,
        })
        this.assessmentById[response.id] = response
        this.currentAssessmentId = response.id
      } catch (error) {
        const errorStore = useToastStore()
        errorStore.setError(error.messageCode)
      }
    },
    addAssessment(assessment) {
      this.assessmentById[assessment.id] = assessment
    },
    async getRepresentativityCriterias() {
      const { data, error } = await useApiGet<RepresentativityCriteria>(
        "representativity-criterias/"
      )
      if (!error.value) {
        this.representativityCriterias = data.value
      } else {
        const errorStore = useToastStore()
        errorStore.setError(error.value.data?.messageCode)
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
    },
  },
})
