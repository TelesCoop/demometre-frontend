<template>
  <div class="container">
    <section class="columns is-centered">
      <div class="column is-8">
        <h1 class="title is-3 has-text-black-ter">
          {{ pageStore.evaluationInitPage.title }}
        </h1>
        <RichText
          :rich-text="pageStore.evaluationInitPage.initializationValidation"
          class="is-family-secondary"
        />

        <NuxtLink to="/evaluation" class="button is-normal is-rounded mt-4"
          ><span>Commencer l'évaluation</span>
          <span class="icon"> <icon size="16" name="arrow-right-line" /> </span
        ></NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { usePageStore } from "~/stores/pageStore"

definePageMeta({
  title: "Initialisation",
  breadcrumb: "Initialisation",
  middleware: ["assessment"],
})

const pageStore = usePageStore()
if (!pageStore.evaluationInitPage.title) {
  pageStore.getEvaluationInitPage()
}
</script>
