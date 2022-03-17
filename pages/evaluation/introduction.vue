<template>
  <div class="container is-fluid">
    <div class="column is-one-third is-offset-one-third">
      <h1 class="title is-3 has-text-black-ter has-text-centered">
        {{ pageStore.evaluationIntroPage.title }}
      </h1>
      <p class="is-family-secondary mt-3 mb-2rem">
        {{ pageStore.evaluationIntroPage.introduction }}
      </p>
      <div class="consent-container">
        <label class="checkbox">
          <input type="checkbox" />
          <RichText
            :richText="pageStore.evaluationIntroPage.dataConsent"
            class="is-size-7"
          />
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePageStore } from "~/stores/pageStore"

const pageStore = usePageStore()

if (!pageStore.evaluationIntroPage.title) {
  pageStore.loadEvaluationIntroPage()
}
</script>

<style scoped lang="sass">
.consent-container
  position: relative

input[type=checkbox]
  filter: grayscale(100%)
  width: 20px
  height: 20px
  margin-left: -40px
  margin-bottom: -40px
  position: absolute
</style>