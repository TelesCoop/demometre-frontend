import { defineStore } from "pinia"
import { User } from "~/composables/types"
import { useApiPost, useGet } from "~/composables/api"
import { useToastStore } from "./toastStore"

export const useUserStore = defineStore("user", {
  state: () => ({
    user: <User>{},
    refreshed: <boolean>false,
  }),
  getters: {
    isLoggedIn() {
      return !!this.user.email
    },
  },
  actions: {
    async login(email: string, password: string) {
      const { data, error } = await useApiPost<User>("auth/login", {
        email,
        password,
      })
      if (!error.value) {
        this.user = data.value
        const router = useRouter()
        router.push("/")
      }
    },
    async signup(
      firstName: string,
      lastName: string,
      email: string,
      password: string
    ) {
      const { data, error } = await useApiPost<User>("auth/signup", {
        firstName,
        lastName,
        email,
        password,
      })
      if (error.value) {
        return { error: error.value.data }
      }
      this.user = data.value
      const router = useRouter()
      router.push("/")
    },
    async logout() {
      const { error } = await useApiPost<User>("auth/logout")
      if (!error.value) {
        this.updateState({ id: null, username: "", email: "" })
        const router = useRouter()
        router.push("/login")
      } else {
        const errorStore = useToastStore()
        errorStore.setError(error.value.data.messageCode)
      }
    },
    async refreshProfile(headers = undefined) {
      this.refreshed = true
      try {
        const response = await useGet<User>("auth/profile", { headers })
        this.user = response
        return true
      } catch (e) {
        return false
      }
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
    updateState(data: User) {
      this.user.username = data.username
      this.user.email = data.email
      this.user.id = 0
    },
  },
})
