<template>
  <div class="result-image-container">
    <div class="container">
      <section class="columns section">
        <div class="column is-5">
          <PageTitle
            :title="pageStore.resultsPage.title"
            :subtitle="pageStore.resultsPage.tagLine"
          />
          <RichText
            :rich-text="pageStore.referentialPage.description"
            class="is-family-secondary"
          />
          <!-- TODO : reduire à seulement les villes qui ont des résultats publiés, sinon écrire qu'il n'y en a pas encore -->
          <v-select
            v-model="assessmentSelected"
            label="name"
            :options="assessmentStore.assessments"
          ></v-select>
          <button
            class="button is-rounded is-shade-600 is-outlined mt-2"
            type="button"
            :disabled="!assessmentSelected"
            @click.prevent="seeResults()"
          >
            <span class="icon">
              <icon size="16" name="bar-chart-box-line" />
            </span>
            <span>Voir les résultats</span>
          </button>
        </div>
      </section>
    </div>
    <div
      class="result-image is-hidden-mobile"
      :style="`background-image: url(${
        MADIA_BASE_URL + pageStore.resultsPage.introImageUrl
      })`"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { usePageStore } from "~/stores/pageStore"
import { MADIA_BASE_URL } from "~/composables/api"
import { useAssessmentStore } from "~/stores/assessmentStore"
import { Assessment } from "~/composables/types"
import vSelect from "vue-select"

definePageMeta({
  title: "Résultats",
  breadcrumb: "Résultats",
})

const pageStore = usePageStore()
const assessmentStore = useAssessmentStore()
const router = useRouter()

if (!pageStore.resultsPage.title) {
  pageStore.getResultsPage()
}
if (!assessmentStore.assessmentsWithResultsLoaded) {
  assessmentStore.getAssesmentsWithPublicatedResults()
}

const assessmentSelected = ref<Assessment>()

const seeResults = () => {
  router.push(`/resultats/${assessmentSelected.value.id}`)
}
</script>

<style scoped lang="sass">
.result-image
  position: absolute
  top: -4rem
  right: 0
  width: 55%
  height: 150%
  background-repeat: repeat
  z-index: -1
  &-container
    position: relative
</style>
