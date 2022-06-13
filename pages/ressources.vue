<template>
  <div class="container">
    <section class="columns section">
      <div class="column is-5">
        <PageTitle
          title="Ressources"
          subtitle="Paragraphe d'intro des ressources"
        />
      </div>
    </section>
    <section>
      <Pagination
        v-slot="paginationProps"
        :list="pageStore.resources"
        :number-per-page="9"
      >
        <div class="columns is-multiline mb-2">
          <div
            v-for="resource of paginationProps.pageList"
            :key="resource.id"
            class="column is-one-third"
          >
            <PageArticleCard
              :article="resource"
              background-color="white"
              :image-height="300"
              :show-linked-pillars="true"
            />
          </div>
        </div>
      </Pagination>
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
