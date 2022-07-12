import { defineStore } from "pinia"
import {
  Assessment,
  RepresentativityCriteria,
  Scores,
} from "~/composables/types"
import { useApiGet, useApiPost } from "~/composables/api"
import { useToastStore } from "./toastStore"
import { useUserStore } from "./userStore"

export const useAssessmentStore = defineStore("assessment", {
  state: () => ({
    assessmentById: <{ [key: number]: Assessment }>{},
    currentAssessmentId: <number>undefined,
    representativityCriterias: <RepresentativityCriteria[]>[],
    assessmentsWithResultsLoaded: <boolean>false,
    scoresByAssessmentId: <{ [key: number]: Scores }>{},
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
    canSeeResultsAssessments() {
      return this.assessments.find(
        (assessment: Assessment) =>
          assessment.publishedResults === true ||
          assessment.id === this.currentAssessmentId
      )
    },
    userIsAssessmentAdmin() {
      return (
        this.currentAssessment.initiatedByUser?.id === useUserStore().user.id
      )
      // TODO : check if current user is assessment expert
    },
    assessmentName: () => {
      return (assessment): string => {
        return assessment.municipality
          ? assessment.municipality.name
          : assessment.epci.name
      }
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
      this.assessmentById[data.value.id].name = this.assessmentName(data.value)
      this.currentAssessmentId = data.value.id
      return true
    },
    async getCurrentAssessment() {
      const response = await useApiGet<Assessment>(`assessments/current`)

      if (response.error.value) {
        return false
      }

      this.assessmentById[response.data.value.id] = response.data.value
      this.assessmentById[response.data.value.id].name = this.assessmentName(
        response.data.value
      )
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
      this.assessmentById[response.data.value.id].name = this.assessmentName(
        response.data.value
      )
      this.currentAssessmentId = response.data.value.id
      return true
    },
    addAssessment(assessment) {
      this.assessmentById[assessment.id] = assessment
    },
    async getAssesmentsWithPublicatedResults() {
      const { data, error } = await useApiGet<Assessment[]>(
        `assessments/published/`
      )
      if (error.value) {
        const errorStore = useToastStore()
        errorStore.setError(error.value.data.messageCode)
        return false
      }
      for (const assessment of data.value) {
        this.assessmentById[assessment.id] = assessment
        this.assessmentById[assessment.id].name =
          this.assessmentName(assessment)
      }
      this.assessmentsWithResultsLoaded = true
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
      this.assessmentById = {}
    },
    async getAssessmentScores(assessmentId) {
      const { data, error } = await useApiGet<Scores>(
        `assessments/${assessmentId}/scores`
      )
      if (error.value) {
        const errorStore = useToastStore()
        errorStore.setError(error.value.data.messageCode)
        return false
      }
      this.scoresByAssessmentId[assessmentId] = data.value
      return true
    },
  },
})
