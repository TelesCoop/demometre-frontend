<template>
  <div class="container">
    <section class="columns section">
      <div class="column is-5">
        <PageIntro title="Blog" introduction="Paragraphe d'intro du blog" />
      </div>
    </section>
    <section>
      <Pagination
        v-slot="paginationProps"
        :list="pageStore.blogPosts"
        :number-per-page="6"
      >
        <div class="columns is-multiline mb-2">
          <div
            v-for="blogPost of paginationProps.pageList"
            :key="blogPost.id"
            class="column is-half"
          >
            <HomepageArticleCard
              :article="blogPost"
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
import { usePageStore } from "~/stores/pageStore"

definePageMeta({
  title: "Blog",
  breadcrumb: "Blog",
})

const pageStore = usePageStore()

if (pageStore.blogPosts.length === 0 && !pageStore.blogLoaded) {
  pageStore.getBlogPosts()
}
</script>

<style scoped lang="sass">
.buttons .button
  height: fit-content
</style>
