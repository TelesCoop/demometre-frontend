<template>
  <div class="container">
    <section class="intro columns section">
      <div class="column">
        <PageIntro
          :title="pageStore.homePage.title"
          :introduction="pageStore.homePage.tagLine"
        />
        <RichText
          :rich-text="pageStore.homePage.introduction"
          class="is-family-secondary"
        />
      </div>
      <div class="column" style="text-align: end">
        <iframe
          v-if="pageStore.homePage.introYoutubeVideoId"
          width="450"
          height="253"
          :src="`https://www.youtube-nocookie.com/embed/${pageStore.homePage.introYoutubeVideoId}`"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
        <figure v-else class="image is-128x128">
          <img :src="BASE_URL + pageStore.homePage.introImageUrl" alt="" />
        </figure>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { usePageStore } from "~/stores/pageStore"
import { BASE_URL } from "~/composables/api"

const pageStore = usePageStore()
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
</style>
