<template>
  <div class="container is-fluid">
    <form
      class="column is-one-third is-offset-one-third"
      action="/evaluation/localisation"
      @submit="onSubmit"
    >
      <h1 class="title is-3 has-text-black-ter has-text-centered">
        {{ pageStore.evaluationIntroPage.title }}
      </h1>
      <p class="is-family-secondary mt-0_75 mb-2">
        {{ pageStore.evaluationIntroPage.introduction }}
      </p>
      <div class="consent-container">
        <label class="checkbox">
          <input type="checkbox" required />
          <RichText
            :rich-text="pageStore.evaluationIntroPage.dataConsent"
            class="is-size-7"
          />
        </label>
      </div>
      <div class="buttons mt-4 is-justify-content-center">
        <!-- TODO rediriger vers en savoir plus une fois la page réalisée -->
        <NuxtLink to="/" class="button is-normal is-rounded"
          >En savoir plus</NuxtLink
        >
        <button class="button is-normal is-rounded">
          <span>Commencer</span>
          <span class="ml-0_5"><check></check></span>
        </button>

        <!-- Permet d'appuyer sur entrer -->
        <input type="submit" hidden />
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { usePageStore } from "~/stores/pageStore"
import Check from "~/components/icons/check.vue"

const pageStore = usePageStore()

if (!pageStore.evaluationIntroPage.title) {
  pageStore.loadEvaluationIntroPage()
}

function onSubmit() {
  this.$route.push("/evaluation/localisation")
}
</script>

<style scoped lang="sass">
.consent-container
  position: relative

input[type=checkbox]
  filter: grayscale(100%)
  width: 20px
  height: 20px
  margin-left: -40px
  margin-bottom: -40px
  position: absolute
</style>
