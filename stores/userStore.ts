import { defineStore } from "pinia"
import { User } from "~/composables/types"
import { useApiGet, useApiPost } from "~/composables/api"

export const useUserStore = defineStore("user", {
  state: () => ({
    user: <User>{},
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
      if (!error.value) {
        this.user = data.value
        const router = useRouter()
        router.push("/")
      }
    },
    async logout() {
      const { error } = await useApiPost<User>("auth/logout")
      if (!error.value) {
        this.updateState({ id: null, username: "", email: "" })
        const router = useRouter()
        router.push("/login")
      }
    },
    async refreshProfile() {
      const { data, error } = await useApiGet<User>("auth/profile")
      if (!error.value) {
        this.user = data.value
      }
    },
    updateState(data: User) {
      this.user.username = data.username
      this.user.email = data.email
      this.user.id = 0
    },
  },
})
