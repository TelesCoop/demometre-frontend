import { defineStore } from "pinia"
import { ErrorMessages } from "~/composables/errors"

export const useToastStore = defineStore("toast", {
  state: () => ({
    type: <string>"",
    message: <string>"",
  }),
  actions: {
    setError(messageCode: string) {
      this.type = "error"
      this.message = ErrorMessages[messageCode] || ErrorMessages.default
      setTimeout(() => {
        this.message = ""
      }, 4000)
    },
    setWarning(message: string) {
      this.type = "warning"
      this.message = message
      setTimeout(() => {
        this.message = ""
      }, 4000)
    },
    setInfo(message: string) {
      this.type = "info"
      this.message = message
      setTimeout(() => {
        this.message = ""
      }, 4000)
    },
  },
})
