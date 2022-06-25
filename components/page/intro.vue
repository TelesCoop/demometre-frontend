<template>
  <div class="container">
    <section
      class="intro columns section is-variable"
      :class="`is-${props.columnGap}`"
    >
      <div class="column" :class="`is-${props.columnDistribution[0]}`">
        <PageTitle :title="props.title" :subtitle="props.subtitle" />
        <RichText
          v-if="props.introduction"
          :rich-text="props.introduction"
          class="is-family-secondary"
        />
        <slot></slot>
      </div>
      <div
        class="column"
        :class="`is-offset-${props.columnDistribution[1]} is-${props.columnDistribution[2]}`"
        style="text-align: end"
      >
        <div v-if="props.youtubeVideoId" class="video-container">
          <iframe
            width="100%"
            height="100%"
            :src="`https://www.youtube-nocookie.com/embed/${props.youtubeVideoId}`"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
        <figure v-else-if="props.imageUrl" class="image is-128x128">
          <img :src="MADIA_BASE_URL + props.imageUrl" alt="" />
        </figure>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { MADIA_BASE_URL } from "~/composables/api"

const props = defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  introduction: { type: String, required: false },
  youtubeVideoId: { type: String, required: false },
  imageUrl: { type: String, required: false },
  columnDistribution: {
    type: Array,
    default() {
      return [6, 0, 6]
    },
  },
  columnGap: { type: Number, default: 8 },
})
</script>

<style scoped lang="sass">
.intro
  .intro__visual
    // TODO change when we have the ressource
    background-clip: content-box
    background-color: $blue
    height: 154px
    @include desktop
      height: revert

.buttons
  &.are-medium-desktop
    .button:not(.is-normal):not(.is-medium):not(.is-large)
      @include desktop
        font-size: 1.25rem

  .button
    margin-bottom: 1rem

.columns.is-variable.is-16
  --columnGap: 4rem
.video-container
  width: 100%
  height: 100%
  max-width: 600px
  max-height: 337px
</style>
