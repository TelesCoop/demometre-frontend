<template>
  <Teleport to="body">
    <div
      class="modal"
      :class="{ 'is-active': participationStore.showCancelParticipationModal }"
    >
      <div
        class="modal-background"
        @click="emit('close')"
      />
      <div class="modal-content has-background-shade-100 p-2">
        <h2 class="is-size-4 has-text-weight-bold pb-0_5">
          Souhaitez-vous réinitialiser votre évaluation&nbsp;?
        </h2>
        <p class="is-text-5 pb-1">
          En réinitialisant l'évaluation, vous perdrez l'ensemble de vos
          réponses.
        </p>
        <div class="buttons">
          <button
            class="button is-shade-600 is-outlined"
            :class="{ 'is-loading': isLoading }"
            @click="cancelParticipation"
          >
            Oui, reinitialiser
          </button>
          <button
            class="button is-shade-600 is-outlined"
            @click="closeModal()"
          >
            Non
          </button>
        </div>
      </div>
      <button
        class="modal-close is-large"
        aria-label="close"
        @click="cancelParticipation"
      />
    </div>
  </Teleport>
</template>
<script setup lang="ts">
import { useParticipationStore } from "~/stores/participationStore"
import { useUserStore } from "~/stores/userStore"
import { useUserStep } from "~/composables/userStep"
import { useRouter } from "vue-router"

const isLoading = ref(false)

const participationStore = useParticipationStore()
const userStore = useUserStore()
const userStep = useUserStep()
const router = useRouter()

const closeModal = () => {
  participationStore.setShowCancelParticipationModal(false)
}

const cancelParticipation = () => {
  isLoading.value = true
  userStore.logout().then(() => {
    isLoading.value = false
    router.push(userStep.value.url)
    closeModal()
  })
}
</script>

<style lang="sass" scoped>
.modal-content
  border-radius: 5px
</style>
