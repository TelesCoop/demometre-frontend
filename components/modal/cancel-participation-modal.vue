<template>
  <Teleport to="body">
    <div
      class="modal"
      :class="{ 'is-active': participationStore.showCancelParticipationModal }"
    >
      <div class="modal-background"></div>
      <div class="modal-content has-background-shade-100 p-2">
        <h2 class="is-size-4 has-text-weight-bold pb-0_5">
          Souhaitez-vous réintialiser votre évaluation ?
        </h2>
        <p class="is-text-5 pb-1">
          En réinitialisant l'évaluation, vous perdrez l'ensemble de vos
          réponses.
        </p>
        <div class="buttons">
          <button
            class="button"
            :class="{ 'is-loading': isLoading }"
            @click="cancelParticipation"
          >
            Oui, recommencer
          </button>
          <button class="button" @click="closeModal()">Non</button>
        </div>
      </div>
      <button
        class="modal-close is-large"
        aria-label="close"
        @click="cancelParticipation"
      ></button>
    </div>
  </Teleport>
</template>
<script setup lang="ts">
import { useParticipationStore } from "~/stores/participationStore"
import { useUserStore } from "~/stores/userStore"
import { ref } from "@vue/reactivity"
import { useUserStep } from "~/composables/userStep"
import { useRouter } from "vue-router"

const props = defineProps({
  isActive: { type: Boolean },
})

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
