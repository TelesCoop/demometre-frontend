<template>
  <div>
    <div class="container">
      <section class="columns section">
        <div class="column is-7">
          <PageTitle
            :title="pageStore.resultsPage.title"
            :subtitle="pageStore.resultsPage.tagLine"
          />
          <RichText
            :rich-text="pageStore.referentialPage.description"
            class="is-family-secondary"
          />
        </div>
        <div class="column is-5 is-hidden-mobile" style="text-align: end">
          <figure class="image">
            <img
              :src="MADIA_BASE_URL + pageStore.resultsPage.introImageUrl"
              alt
            />
          </figure>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePageStore } from "~/stores/pageStore"
import { MADIA_BASE_URL } from "~/composables/api"

definePageMeta({
  title: "Résultats",
  breadcrumb: "Résultats",
})

const pageStore = usePageStore()

if (!pageStore.resultsPage.title) {
  pageStore.getResultsPage()
}
</script>

<style scoped lang="sass">
img
  width: 100%
  object-fit: cover
</style>
