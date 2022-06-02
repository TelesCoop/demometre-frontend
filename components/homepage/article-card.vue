<template>
  <div>
    <div
      :class="`card has-background-${backgroundColor} is-fullheight`"
      @click.prevent="openArticle"
    >
      <div class="card-image">
        <figure class="image is-4by3">
          <img
            :src="BASE_URL + props.article.imageUrl"
            alt=""
            :style="`max-height: ${props.imageHeight}px`"
          />
        </figure>
      </div>
      <div class="card-content">
        <div class="mb-1_5">
          <p class="is-size-4 has-text-shade-600 has-text-weight-bold">
            {{ props.article.title }}
          </p>
          <p class="has-text-shade-500">{{ props.article.publicationDate }}</p>
        </div>
        <div class="content is-family-secondary is-size-6">
          {{ props.article.shortDescription }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BASE_URL } from "~/composables/api"

const props = defineProps({
  article: { type: Object, required: true },
  backgroundColor: { type: String, required: true },
  imageHeight: { type: Number, required: true },
})

const openArticle = () => {
  if (props.article.externalLink) {
    window.open(props.article.externalLink, "_blank")
  }
}
</script>

<style scoped lang="sass">
img
  width: 100%
  object-fit: cover
</style>
