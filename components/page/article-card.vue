<template>
  <a
    :class="`card has-background-${backgroundColor} is-fullheight is-clickable`"
    :href="props.article.externalLink"
    target="_blank"
    rel="external noopener noreferrer"
  >
    <div class="card-image">
      <figure class="image is-4by3">
        <img
          :src="MADIA_BASE_URL + props.article.imageUrl"
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
      <div class="content">
        <p class="is-family-secondary is-size-6">
          {{ props.article.shortDescription }}
        </p>
        <div v-if="props.showLinkedPillars" class="is-size-7 mt-2">
          <span
            v-for="pillarId of props.article.pillars"
            :key="pillarId"
            :class="`tag mr-0_5 is-${
              PillarParams[questionnaireStore.getPillarNameById(pillarId)].color
            }`"
            style="padding: 6px 12px"
            >{{
              wordTitleCase(questionnaireStore.getPillarNameById(pillarId))
            }}</span
          >
        </div>
      </div>
    </div>
  </a>
</template>

<script setup lang="ts">
import { MADIA_BASE_URL } from "~/composables/api"
import { useQuestionnaireStore } from "~/stores/questionnaireStore"
import { PillarParams } from "~/composables/types"
import { wordTitleCase } from "~/utils/title-case"

const props = defineProps({
  article: { type: Object, required: true },
  backgroundColor: { type: String, required: true },
  imageHeight: { type: Number, required: true },
  showLinkedPillars: { type: Boolean, default: false },
})

const questionnaireStore = useQuestionnaireStore()
</script>

<style scoped lang="sass">
img
  width: 100%
  object-fit: cover
</style>