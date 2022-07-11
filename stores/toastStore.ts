import { defineStore } from "pinia"
import { ErrorMessages } from "~/composables/errors"

export const useToastStore = defineStore("toast", {
  state: () => ({
    type: <string>"",
    message: <string>"",
  }),
  actions: {
    setMessage(message: string, type: string, duration: number) {
      this.type = type
      this.message = message
      setTimeout(() => {
        this.message = ""
      }, duration)
    },

    setError(messageCode: string) {
      this.setMessage(
        ErrorMessages[messageCode] || ErrorMessages.default,
        "error",
        4000
      )
    },
    setWarning(message: string) {
      this.setMessage(message, "warning", 4000)
    },
    setInfo(message: string) {
      this.setMessage(message, "info", 4000)
    },
  },
})
