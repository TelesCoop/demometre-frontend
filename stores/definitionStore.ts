import { defineStore } from "pinia"
import { useApiGet } from "~~/composables/api"
import { Definition } from "~/composables/types"
import { pick } from "~/composables/tools"

type DefinitionResponse = Definition[]

export const useDefinitionStore = defineStore("definition", {
  state: () => ({
    definitionById: <{ [key: number]: Definition }>{},
  }),
  actions: {
    async loadDefinitions() {
      const { data = ref<DefinitionResponse>(), error = ref() } =
        await useApiGet<DefinitionResponse>("definitions/")

      if (!error.value) {
        for (const definition of data.value) {
          this.definitionById[definition.id] = definition
        }
      }
    },
    async getDefinitions() {
      if (!Object.keys(this.definitionById).length) await this.loadDefinitions()
    },
    definitionsByIdArray(ids: number[]) {
      return pick(this.definitionById, ids)
    },
  },
})
