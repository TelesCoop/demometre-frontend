import { defineStore } from "pinia"
import { User } from "~/composables/types"
import { useApiGet, useApiPost } from "~/composables/api"
import { useToastStore } from "./toastStore"
import { cleanUserData, getUserData } from "~/composables/actions"

export const useUserStore = defineStore("user", {
  state: () => ({
    user: <User>{},
    nbreCallback: <number>-1,
  }),
  getters: {
    isLoggedIn() {
      return !!this.user.email && !this.user.isUnknownUser
    },
    isUnknownUser() {
      return this.user?.isUnknownUser
    },
    isExpertUser() {
      return this.user?.isExpert
    },
  },
  actions: {
    async createUnknownUser() {
      const { data, error } = await useApiPost<User>("auth/unknown-user")
      if (error.value) {
        const errorStore = useToastStore()
        errorStore.setError(error.value.data.messageCode)
        return false
      }
      this.user = data.value
    },
    async login(email: string, password: string) {
      cleanUserData()
      const { data, error } = await useApiPost<User>("auth/login", {
        email,
        password,
      })
      if (!error.value) {
        this.user = data.value
        await getUserData()
        useRouter().go(this.nbreCallback)
      }
    },
    async signup(email: string, password: string) {
      const { data, error } = await useApiPost<User>("auth/signup", {
        email,
        password,
      })
      if (error.value) {
        return { error: error.value.data }
      }
      this.user = data.value
      await getUserData()

      useRouter().go(this.nbreCallback)
    },
    async logout() {
      const { error } = await useApiPost<User>("auth/logout")
      if (!error.value) {
        this.user = { id: null, username: "", email: "" }
        cleanUserData()
        const router = useRouter()
        router.push("/login")
      } else {
        const errorStore = useToastStore()
        errorStore.setError(error.value.data.messageCode)
      }
    },
    async refreshProfile(showError = true) {
      const response = await useApiGet<User>(`auth/profile`)
      if (response.error.value) {
        if (showError) {
          const errorStore = useToastStore()
          errorStore.setError(response.error.value.data.messageCode)
        }
        return false
      }
      this.user = response.data.value
      return true
    },
    async sendResetLink(email: string) {
      const { error } = await useApiPost<User>(
        "auth/user/reset-password-link",
        {
          email,
        }
      )
      if (!error.value) {
        const router = useRouter()
        router.push("/nouveau-mdp-confirmation")
      } else {
        const errorStore = useToastStore()
        errorStore.setError(error.value.data.messageCode)
      }
    },
    async resetPassword(resetKey: string, password: string) {
      const { error } = await useApiPost<User>("auth/user/reset-password", {
        password,
        resetKey,
      })
      if (!error.value) {
        const router = useRouter()
        router.replace({ query: { reset_key: null } })
        router.push("/login")
      } else {
        const errorStore = useToastStore()
        errorStore.setError(error.value.data.messageCode)
      }
    },
  },
})
