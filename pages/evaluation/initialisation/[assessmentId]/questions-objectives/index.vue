<template>
  <div class="container">
    <section class="columns is-centered">
      <div class="column is-8">
        <h1 class="title is-3 has-text-black-ter">
          Vous devez maintenant répondre aux questions objectives
        </h1>

        <button
          class="button is-normal is-rounded mt-4"
          @click.prevent="goToFirstObjectiveQuestion"
        >
          <span>Commencer les questions objectives</span>
          <span class="icon">
            <icon v-if="isLoading" size="24" name="loader-2-line" />
            <icon v-else size="16" name="arrow-right-line" />
          </span>
        </button>
        <span v-if="isLoading" class="is-size-7 has-text-shade-600">
          en cours de chargement
        </span>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useInitializationJourney } from "~/composables/journey"

definePageMeta({
  title: "Initialisation",
  breadcrumb: "Initialisation",
  step: "initialization-objectives-questions",
  middleware: ["assessment", "user-step"],
})

const isLoading = ref(false)

const goToFirstObjectiveQuestion = () => {
  isLoading.value = true
  useInitializationJourney().goToNextQuestion(undefined)
}
</script>
