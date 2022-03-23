import { defineStore } from "pinia"
import { Assessment } from "~/composables/types"
import { useApiGet } from "~~/composables/api"

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
    // async loadAssessments({ zipCode }) {
    //   const { data, error } = await useApiGet<AssessmentResponse>(
    //     `assessments/by-locality?zip_code=${zipCode}&locality_type=${locality_type}`
    //   )
    //   if (!error.value) {
    //     for (const assessment of data.value.items) {
    //       this.assessmentById[assessment.id] = assessment
    //     }
    //   }
    // },
    async getOrCreateAssessment({ zipCode, localityType }) {
      const { data, error } = await useApiGet<Assessment>(
        `assessments/by-locality/?zip_code=${zipCode}&locality_type=${localityType}`
      )
      console.log("RECEIVE DATA")
      console.log(data)
      console.log(error)
      if (!error.value) {
        this.assessmentById[data.value.id] = data.value
        this.currentAssessmentId = data.value.id
      }
    }
  },
})
