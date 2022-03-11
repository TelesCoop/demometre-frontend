<template>
  <section class="intro columns section">
    <div class="column">
      <div class="intro__text">
        <h1 class="title is-1-desktop is-2">{{ homepage.title }}</h1>
        <div class="is-family-secondary is-size-5 is-size-4-desktop">
          {{ homepage.introduction }}
        </div>
      </div>
      <div class="intro__buttons buttons are-medium-desktop">
        <nuxt-link
          class="button is-dark is-rounded is-responsive"
          to="/evaluation"
        >
          Lancer l'évaluation
          <!-- TODO change label and link when connected -->
        </nuxt-link>
        <nuxt-link
          class="button is-dark is-rounded is-responsive is-outlined"
          to="/pilliers"
        >
          <span>Découvrir le référentiel</span>
          <span class="icon"><i class="ri-arrow-right-line" /></span>
        </nuxt-link>
      </div>
    </div>
    <div class="intro__visual column bg-warning"></div>
  </section>
</template>

<script setup lang="ts">
import { useApiGet } from "~/composables/api"
import { Homepage } from "~/composables/types"

const homepage = ref<Homepage>()
await getHomepage()

async function getHomepage() {
  const { data, error } = await useApiGet<{ items: Homepage[] }>(
    "/cms/homepages/"
  )
  if (!error.value) {
    homepage.value = data.value.items[0]
  }
}
</script>

<style scoped lang="sass">
.intro
  @include desktop
    padding-top: 120px

  .intro__text
    padding: 0 60px 60px 0

  .intro__visual
    // TODO change when we have the ressource
    background-clip: content-box
    background-color: #2e738e
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
