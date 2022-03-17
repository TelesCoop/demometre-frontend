import { defineStore } from "pinia"
import { HomePage, ReferentialPage } from "~/composables/types"
import { useApiGet } from "~~/composables/api"

export const usePageStore = defineStore("page", {
  state: () => ({
    homePage: <HomePage>{},
    referentialPage: <ReferentialPage>{},
  }),
  actions: {
    async loadHomePage() {
      const { data, error } = await useApiGet<{ items: HomePage[] }>(
        "cms/homepages/"
      )
      if (!error.value) {
        this.homepage = data.value.items[0]
      }
    },
    async loadReferentialPage() {
      const { data, error } = await useApiGet<{ items: ReferentialPage[] }>(
        "cms/referentialpages/"
      )
      if (!error.value) {
        this.referentialPage = data.value.items[0]
      }
    }
  },
})
