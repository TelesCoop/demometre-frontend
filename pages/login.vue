<script setup lang="ts">
import { useUserStore } from "~/stores/userStore"
import { useLoadingStore } from "~/stores/loadingStore"

const email = ref("")
const isEmailUntouched = ref(true)
const isPasswordUntouched = ref(true)
const passwordErrorMessage = ref("")
const password = ref("")
const userStore = useUserStore()
const loadingStore = useLoadingStore()

const onEmailUpdate = () => {
  isEmailUntouched.value = false
  console.log("### onEmailUpdate", email.value)
}
const onPasswordUpdate = () => {
  isPasswordUntouched.value = false
  console.log("### onPasswordUpdate")
}
const emailErrorMessage = computed(() => {
  if (isEmailUntouched.value) {
    return ""
  }

  console.log("### emailErrorMessage?", email.value)

  if (!email.value.includes("@")) {
    return "Le courriel doit contenir @"
    return false
  }

  console.log("### is valid")

  return ""
})
const isMailValid = computed(
  () => isEmailUntouched.value || !emailErrorMessage.value
)
const isPasswordValid = computed(() => {
  if (isPasswordUntouched.value) {
    return true
  }

  console.log("### isPasswordValid?", password.value)

  if (!password.value.length) {
    passwordErrorMessage.value = "Le mot de passe ne peut pas être vide"
    return false
  }

  passwordErrorMessage.value = ""
  console.log("### is valid")

  return true
})
const submit = () => {
  console.log("submit", email.value, password.value)
  userStore.login(email.value, password.value)
}
</script>

<template>
  <div class="is-flex flex-center">
    <div class="sm-container">
      <h1 class="title is-1">Connexion</h1>

      <!-- email -->
      <div class="field">
        <label class="label">Courriel</label>
        <div class="control has-icons-left has-icons-right">
          <input
            v-model="email"
            class="input"
            type="email"
            placeholder="jean@laposte.fr"
            :class="isMailValid ? '' : 'is-danger'"
            @change="onEmailUpdate"
          />
          <span class="icon is-small is-left">
            <i>
              <Icon color="#b5b5b5" name="mail-line" />
            </i>
          </span>
          <span v-if="!isMailValid" class="icon is-small is-right">
            <i class="fas fa-exclamation-triangle"></i>
          </span>
        </div>
        <p v-if="!isMailValid" class="help is-danger">
          {{ emailErrorMessage }}
        </p>
      </div>

      <!-- password -->
      <div class="field">
        <label class="label">Mot de passe</label>
        <div class="control has-icons-left has-icons-right">
          <input
            v-model="password"
            class="input"
            type="password"
            placeholder="mot de passe"
            :class="isPasswordValid ? '' : 'is-danger'"
            @change="onPasswordUpdate"
          />
          <span class="icon is-small is-left">
            <i>
              <Icon color="#b5b5b5" name="lock-line" />
            </i>
          </span>
          <span v-if="!isPasswordValid" class="icon is-small is-right">
            <i class="fas fa-exclamation-triangle"></i>
          </span>
        </div>
        <p v-if="!isPasswordValid" class="help is-danger">
          {{ passwordErrorMessage }}
        </p>
      </div>

      <!-- submit -->
      <div class="mt-4">
        <button
          class="button is-success is-medium"
          type="button"
          @click="submit"
        >
          Connexion
        </button>
      </div>
    </div>
  </div>
</template>
