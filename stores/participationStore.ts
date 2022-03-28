import { defineStore } from "pinia"
import { Participation } from "~/composables/types"
import { useApiPost } from "~~/composables/api"

export const useParticipationStore = defineStore("participation", {
  state: () => ({
    participation: <Participation>{},
  }),
  actions: {
    async createParticipation() {
      const { data, error } = await useApiPost<Participation>(
        "participation/",
        {
          ...this.participation,
        }
      )
      if (!error.value) {
        this.participation = data.value
      }
    },
    // async updateParticipation() {
    //   const { data, error } = await useApiPost<Participation>(
    //     `participation/${this.participation.id}`, {
    //     ...this.participation
    //   }
    //   )
    //   if (!error.value) {

    //   }
    // },
    async consent() {
      console.log("JE CONSENT")
      this.participation.consent = true
    },
    async chooseRole(roleId) {
      this.participation.roleId = roleId
    },
    async chooseAssessment(assessmentId) {
      this.participation.assessmentId = assessmentId
    },
  },
})
