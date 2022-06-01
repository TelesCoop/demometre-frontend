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
          <span class="icon"> <icon size="16" name="arrow-right-line" /> </span>
        </button>
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

const goToFirstObjectiveQuestion = () => {
  useInitializationJourney().goToNextQuestion(undefined)
}
</script>
