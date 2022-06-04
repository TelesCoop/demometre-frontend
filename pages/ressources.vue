<template>
  <div class="container">
    <section class="columns section">
      <div class="column is-5">
        <PageIntro
          title="Ressources"
          introduction="Paragraphe d'intro des ressources"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { usePageStore } from "~~/stores/pageStore"

definePageMeta({
  title: "Ressources",
  breadcrumb: "Ressources",
})

const pageStore = usePageStore()

if (pageStore.resources.length === 0 && !pageStore.resourcesLoaded) {
  pageStore.getResources()
}
</script>

<style scoped lang="sass">
.buttons .button
  height: fit-content
</style>
