import { defineStore } from "pinia"
import { EvaluationIntroPage, HomePage, ReferentialPage } from "~/composables/types"
import { useApiGet } from "~~/composables/api"

export const usePageStore = defineStore("page", {
  state: () => ({
    homePage: <HomePage>{},
    referentialPage: <ReferentialPage>{},
    evaluationIntroPage: <EvaluationIntroPage>{},
  }),
  actions: {
    async loadHomePage() {
      const { data, error } = await useApiGet<HomePage[]>(
        "home-pages/"
      )
      if (!error.value) {
        if (data.value.length) {
          this.homePage = data.value[0]
        } else {
          console.error("Impossible to retrieve home page")
        }
      }
    },
    async loadReferentialPage() {
      const { data, error } = await useApiGet<ReferentialPage[]>(
        "referential-pages/"
      )
      if (!error.value) {
        if (data.value.length) {
          this.referentialPage = data.value[0]
        } else {
          console.error("Impossible to retrieve referential page")
        }
      }
    },
    async loadEvaluationIntroPage() {
      const { data, error } = await useApiGet<EvaluationIntroPage[]>(
        "evaluation-intro-pages/"
      )
      if (!error.value) {
        if (data.value.length) {
          this.evaluationIntroPage = data.value[0]
        } else {
          console.error("Impossible to retrieve evaluation intro page")
        }
      }
    }
  },
})
