<template>
  <div class="is-flex flex-center">
    <div class="sm-container">
      <div class="mt-2">
        <h1 class="title is-1">
          <span v-if="!hasResetKey">Récupérer mon <br />mot de passe</span>
          <span v-else>Changer mon <br />mot de passe</span>
        </h1>

        <div v-if="!hasResetKey" class="">
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
                <icon size="24" color="$shade-600" name="mail-line" />
              </span>
              <span v-if="!isMailValid" class="icon is-small is-right">
                <i class="fas fa-exclamation-triangle"></i>
              </span>
            </div>
            <p v-if="!isMailValid" class="help is-danger">
              {{ emailErrorMessage }}
            </p>
          </div>

          <button
            class="button is-dark is-small"
            type="button"
            :disabled="emailDisabled"
            @click="sendResetLink"
          >
            Envoyer un lien de récupération
          </button>
        </div>
        <div v-else class="mt-2">
          <!-- password -->
          <div class="field">
            <label class="label">Nouveau mot de passe</label>
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
              <span class="icon is-small is-left">
                <icon size="24" color="$shade-600" name="lock-line" />
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
            <label class="label">Confirmer le nouveau mot de passe</label>
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
              <span class="icon is-small is-left">
                <icon size="24" color="$shade-600" name="lock-line" />
              </span>
              <span v-if="!isSamePassword" class="icon is-small is-right">
                <i class="fas fa-exclamation-triangle"></i>
              </span>
            </div>
            <p v-if="!isSamePassword" class="help is-danger">
              {{ confirmPasswordErrorMessage }}
            </p>
          </div>
          <button
            class="button is-small"
            type="button"
            :disabled="passwordDisabled"
            @click="resetPassword"
          >
            <span class="icon">
              <icon size="16" name="mail-line" />
            </span>
            <span>Confirmer</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "~/stores/userStore"

definePageMeta({
  title: "Nouveau mot de passe",
})

const email = ref("")
const isEmailUntouched = ref(true)
const isPasswordUntouched = ref(true)
const passwordErrorMessage = ref("")
const password = ref("")
const confirmPassword = ref("")
const confirmPasswordErrorMessage = ref("")
const userStore = useUserStore()
const hasResetKey = computed(() => !!useRoute().query.reset_key)

const route = useRoute()

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
const emailDisabled = computed(() => !(isMailValid && email.value))
const passwordDisabled = computed(
  () => !(isPasswordValid && isSamePassword && password.value)
)
const sendResetLink = () => {
  userStore.sendResetLink(email.value)
}
const resetPassword = () => {
  const resetKey = useRoute().query.reset_key
  if (typeof resetKey === "string") {
    userStore.resetPassword(resetKey, password.value)
  } else {
    userStore.resetPassword(resetKey[0], password.value)
  }
}
</script>
