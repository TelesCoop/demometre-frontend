<template>
  <div class="container">
    <section class="columns section">
      <div class="column is-5">
        <template v-if="post">
          <ArticleContent :content="post.content" />
        </template>
        <template v-else />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { usePageStore } from "~/stores/pageStore"

const route = useRoute()
const pageStore = usePageStore()
const slug: string = (route.params.slug as string)
if (!pageStore.blogPostsBySlug[slug]) {
  await pageStore.getBlogPost(slug)
  console.log("### loading for slug", slug)
}
const post = pageStore.blogPostsBySlug[slug]
</script>
