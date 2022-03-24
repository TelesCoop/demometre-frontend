import { defineStore } from "pinia"
import { Assessment } from "~/composables/types"
import { useApiGet } from "~~/composables/api"
import { useErrorStore } from "./errorStore"

export const useAssessmentStore = defineStore("assessment", {
  state: () => ({
    assessmentById: <{ [key: number]: Assessment }>{},
    currentAssessmentId: <number>{},
  }),
  getters: {
    assessments() {
      return Object.values(this.assessmentById)
    },
    municipalityAssessments() {
      return this.assessments.find(
        (assessment: Assessment) => assessment.type === "municipality"
      )
    },
    intercommunalityAssessments() {
      return this.assessments.find(
        (assessment: Assessment) => assessment.type === "intercommunality"
      )
    },
    currentAssessment() {
      return this.assessmentById[this.currentAssessmentId]
    },
  },
  actions: {
    async getOrCreateAssessment({ zipCode, localityType }) {
      const { data, error } = await useApiGet<Assessment>(
        `assessments/by-locality/?zip_code=${zipCode}&locality_type=${localityType}`
      )
      if (error.value) {
        const errorStore = useErrorStore()
        errorStore.setError(error.value.data)
        return error.value.data
      }
      if (!error.value) {
        this.assessmentById[data.value.id] = data.value
        this.currentAssessmentId = data.value.id
      }
    },
  },
})
