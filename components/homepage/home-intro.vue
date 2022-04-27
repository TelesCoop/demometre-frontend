<template>
  <section class="intro columns section">
    <div class="column">
      <PageIntro
        :title="pageStore.homePage.title"
        :introduction="pageStore.homePage.introduction"
      />
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
          to="/demometre"
        >
          <span>Découvrir le référentiel</span>

          <span class="icon">
            <icon name="arrow-right-line" />
          </span>
        </nuxt-link>
      </div>
    </div>
    <div class="intro__visual column bg-warning"></div>
  </section>
</template>

<script setup lang="ts">
import { usePageStore } from "~/stores/pageStore"

const pageStore = usePageStore()

if (!pageStore.homePage.title) {
  pageStore.loadHomePage()
}
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
