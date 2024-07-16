<template>
  <div class="is-flex flex-center">
    <div class="sm-container">
      <form
        class="my-8"
        @submit.prevent="onSubmit"
      >
        <h1 class="title is-1 has-text-shade-800">
          Connexion
        </h1>

        <!-- email -->
        <div class="field has-text-shade-800">
          <label class="label">Courriel</label>
          <div class="control has-icons-left has-icons-right">
            <input
              v-model="email"
              class="input"
              type="email"
              placeholder="jean@laposte.fr"
              :class="isMailValid ? '' : 'is-danger'"
              @change="onEmailUpdate"
            >
            <span class="icon is-small is-left has-text-shade-600">
              <icon
                size="24"
                name="mail-line"
              />
            </span>
            <span
              v-if="!isMailValid"
              class="icon is-small is-right"
            >
              <i class="fas fa-exclamation-triangle" />
            </span>
          </div>
          <p
            v-if="!isMailValid"
            class="help is-danger width-fit-content"
          >
            {{ emailErrorMessage }}
          </p>
        </div>

        <!-- password -->
        <div class="field has-text-shade-800">
          <label class="label">Mot de passe</label>
          <div class="control has-icons-left has-icons-right">
            <input
              v-model="password"
              class="input"
              type="password"
              placeholder="mot de passe"
              :class="isPasswordValid ? '' : 'is-danger'"
              @change="onPasswordUpdate"
            >
            <span class="icon is-small is-left has-text-shade-600">
              <icon
                size="24"
                name="lock-line"
              />
            </span>
            <span
              v-if="!isPasswordValid"
              class="icon is-small is-right"
            >
              <i class="fas fa-exclamation-triangle" />
            </span>
          </div>
          <p
            v-if="!isPasswordValid"
            class="help is-danger width-fit-content"
          >
            {{ passwordErrorMessage }}
          </p>
        </div>

        <!-- submit -->
        <div class="mt-1 is-flex is-justify-content-space-between">
          <div>
            <NuxtLink
              to="/nouveau-mdp"
              class="has-text-shade-500"
              style="text-decoration-line: revert"
            >
              Mot de passe oublié ?
            </NuxtLink>
          </div>
          <button
            class="button is-shade-600 is-small"
            :disabled="disabled"
          >
            <span>Connexion</span>
            <span class="icon">
              <icon
                size="16"
                name="check"
              />
            </span>
          </button>

          <!-- Permet d'appuyer sur entrer -->
          <input
            type="submit"
            hidden
          >
        </div>
        <div class="mt-1">
          <span class="is-size-7 has-text-shade-800">
            Vous n'avez pas encore de compte ?
            <NuxtLink
              to="/signup"
              class="has-text-shade-500"
              style="text-decoration-line: revert"
              @click="
                () => {
                  userStore.afterLoginRouterGoStep -= 1
                }
              "
            >Créez-en un</NuxtLink>
          </span>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "~/stores/userStore"
definePageMeta({
  title: "Connexion",
})

const email = ref("")
const isEmailUntouched = ref(true)
const isPasswordUntouched = ref(true)
const passwordErrorMessage = ref("")
const password = ref("")
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
  return ""
})
const isMailValid = computed(
  () => isEmailUntouched.value || !emailErrorMessage.value,
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
const disabled = computed(
  () => !(isMailValid && isPasswordValid && password.value && email.value),
)
function onSubmit() {
  userStore.login(email.value, password.value)
}
</script>
