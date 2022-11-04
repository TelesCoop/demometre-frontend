<template>
  <div class="container">
    <section class="columns section">
      <div class="column is-5">
        <PageTitle :title="pageStore.importantPages.faqPage?.title" />
      </div>
    </section>
    <section>
      <RichText :rich-text="pageStore.importantPages.faqPage?.content" />
    </section>
  </div>
</template>

<script setup lang="ts">
import { usePageStore } from "~/stores/pageStore"

definePageMeta({
  title: "FAQ",
  breadcrumb: "FAQ",
})

const pageStore = usePageStore()

if (!pageStore.importantPages.faqPage?.title) {
  pageStore.getImportantPages()
}
</script>

<style scoped lang="sass">
.buttons .button
  height: fit-content
</style>
