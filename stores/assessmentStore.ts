import { defineStore } from "pinia"
import {Assessment} from "~/composables/types"
import { useApiGet } from "~~/composables/api"

type AssessmentResponse = { items: Assessment[] }

export const useAssessmentStore = defineStore('assessment', {
    state: () => ({
        assessmentById: <{ [key: number]: Assessment }>{}
    }),
    getters: {
        assessments() {
            return Object.values(this.assessmentById)
        },
        municipalityAssessment() {
            return this.assessments.find((assessment: Assessment) => assessment.type === "municipality")
        },
        intercommunalityAssessment() {
            return this.assessments.find((assessment: Assessment) => assessment.type === "intercommunality")
        },
    },
    actions: {
        async loadAssessments({zipCode}) {
            const { data, error } = await useApiGet<AssessmentResponse>(`assessments?zip_code=${zipCode}`)
            if (!error.value) {
                for (const assessment of data.value.items) {
                    this.assessmentById[assessment.id] = assessment
                }
            }
        }
    },
})
