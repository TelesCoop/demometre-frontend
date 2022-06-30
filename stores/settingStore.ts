import { defineStore } from "pinia"
import { RgpdSettings } from "~/composables/types"
import { useApiGet } from "~~/composables/api"
import { useToastStore } from "./toastStore"

export const useSettingStore = defineStore("setting", {
  state: () => ({
    rgpdSettings: <RgpdSettings>{},
    rgpdSettingsLoaded: <boolean>false,
  }),
  actions: {
    async getRgpdSettings() {
      const { data, error } = await useApiGet<RgpdSettings[]>("settings/")
      if (!error.value) {
        if (data.value.length) {
          this.rgpdSettings = data.value[0]
        } else {
          console.error("Impossible to retrieve setting")
        }
        this.rgpdSettingsLoaded = true
      } else {
        const errorStore = useToastStore()
        errorStore.setError(error.value.data.messageCode)
      }
    },
  },
})
