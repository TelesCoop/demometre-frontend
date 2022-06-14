<template>
  <div class="is-flex flex-center">
    <div class="sm-container">
      <form class="my-8" @submit.prevent="onSubmit">
        <h1 class="title is-1 has-text-shade-800">Création de compte</h1>

        <!-- first name -->
        <div class="field has-text-shade-800">
          <label class="label">Prénom</label>
          <div class="control has-icons-left has-icons-right">
            <input
              v-model="firstName"
              class="input"
              type="text"
              placeholder="Caroline"
            />
            <span v-if="!isMailValid" class="icon is-small is-right">
              <i class="fas fa-exclamation-triangle"></i>
            </span>
          </div>
        </div>

        <!-- last name -->
        <div class="field">
          <label class="label">Nom de famille</label>
          <div class="control has-icons-left has-icons-right">
            <input
              v-model="lastName"
              class="input"
              type="text"
              placeholder="Dupond"
            />
          </div>
        </div>

        <!-- email -->
        <div class="field">
          <label class="label">Courriel</label>
          <div class="control has-icons-left has-icons-right">
            <input
              v-model="email"
              class="input"
              type="email"
              placeholder="caroline.dupond@laposte.fr"
              :class="isMailValid ? '' : 'is-danger'"
              required
              @change="onEmailUpdate"
            />
            <span class="icon is-small is-left has-text-shade-600">
              <icon size="24" name="mail-line" />
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
              required
              @change="onPasswordUpdate"
            />
            <span class="icon is-small is-left has-text-shade-600">
              <icon size="24" name="lock-line" />
            </span>
            <span v-if="!isPasswordValid" class="icon is-small is-right">
              <i class="fas fa-exclamation-triangle"></i>
            </span>
          </div>
          <p v-if="!isPasswordValid" class="help is-danger">
            {{ passwordErrorMessage }}
          </p>
        </div>

        <!-- password confirmation-->
        <div class="field">
          <label class="label">Confirmer le mot de passe</label>
          <div class="control has-icons-left has-icons-right">
            <input
              v-model="confirmPassword"
              class="input"
              type="password"
              placeholder="mot de passe"
              :class="isSamePassword ? '' : 'is-danger'"
              required
              @change="onPasswordUpdate"
            />
            <span class="icon is-small is-left has-text-shade-600">
              <icon size="24" name="lock-line" />
            </span>
            <span v-if="!isSamePassword" class="icon is-small is-right">
              <i class="fas fa-exclamation-triangle"></i>
            </span>
          </div>
          <p v-if="!isSamePassword" class="help is-danger">
            {{ confirmPasswordErrorMessage }}
          </p>
        </div>

        <!-- submit -->
        <div class="mt-1" style="text-align: end">
          <button class="button is-shade-600 is-small" :disabled="disabled">
            <span>S'inscrire</span>
            <span class="icon">
              <icon size="16" name="check" />
            </span>
          </button>

          <!-- Permet d'appuyer sur entrer -->
          <input type="submit" hidden />
        </div>
        <div class="mt-1">
          <span class="is-size-7 has-text-shade-800"
            >Vous avez déjà un compte ?
            <NuxtLink
              to="/login"
              class="has-text-shade-500"
              style="text-decoration-line: revert"
            >
              Connectez-vous</NuxtLink
            ></span
          >
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "~/stores/userStore"
import { ErrorMessages } from "~/composables/errors"

const firstName = ref("")
const lastName = ref("")
const email = ref("")
const isEmailUntouched = ref(true)
const isPasswordUntouched = ref(true)
const passwordErrorMessage = ref("")
const confirmPasswordErrorMessage = ref("")
const password = ref("")
const confirmPassword = ref("")
const confirmSignupErrorMessage = reactive({ field: "", message: "" })
const userStore = useUserStore()

const onEmailUpdate = () => {
  isEmailUntouched.value = false
}
const onPasswordUpdate = () => {
  isPasswordUntouched.value = false
}
const emailErrorMessage = computed(() => {
  if (isEmailUntouched.value) {
    return ""
  }
  if (!email.value.includes("@")) {
    return "Le courriel doit contenir @"
  }
  if (confirmSignupErrorMessage.field == "email")
    return confirmSignupErrorMessage.message
})
const isMailValid = computed(
  () => isEmailUntouched.value || !emailErrorMessage.value
)
const isPasswordValid = computed(() => {
  if (isPasswordUntouched.value) {
    return true
  }
  if (!password.value.length) {
    passwordErrorMessage.value = "Le mot de passe ne peut pas être vide"
    return false
  }
  passwordErrorMessage.value = ""
  return true
})
const isSamePassword = computed(() => {
  if (isPasswordUntouched.value) {
    return true
  }
  if (password.value === confirmPassword.value) {
    confirmPasswordErrorMessage.value = ""
    return true
  }
  confirmPasswordErrorMessage.value = "Les deux mots de passe sont différents"
  return false
})
const disabled = computed(
  () =>
    !(
      isMailValid &&
      isPasswordValid &&
      isSamePassword &&
      password.value &&
      email.value
    )
)
async function onSubmit() {
  const response = await userStore.signup(
    firstName.value,
    lastName.value,
    email.value,
    password.value
  )
  if (response && response.error) {
    confirmSignupErrorMessage.field = response.error.field
    confirmSignupErrorMessage.message =
      ErrorMessages[response.error.messageCode] || ErrorMessages.default
  }
}
</script>
