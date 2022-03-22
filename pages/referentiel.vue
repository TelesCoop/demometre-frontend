<template>
  <div class="container">
    <section class="columns section">
      <div class="column is-5">
        <PageIntro
          :title="pageStore.referentialPage.title"
          :introduction="pageStore.referentialPage.introduction"
        />
        <div class="buttons are-normal">
          <!-- TODO : change link to the right page -->
          <nuxt-link
            class="button is-dark is-rounded is-responsive is-outlined"
            to="/"
          >
            <span>Comment on a construit le référentiel</span>

            <span class="icon">
              <icon name="arrow-right-line" size="20" />
            </span>
          </nuxt-link>
        </div>
        <p class="is-size-6 has-text-grey">
          Sélectionnez l’un des piliers pour en savoir plus sur les marqueurs et
          les critères qui le composent.
        </p>
      </div>
      <div class="column is-6 is-offset-1" style="background-color: pink">
        ICI SCHEMA PILIERS
      </div>
    </section>
    <hr />
    <div class="columns is-multiline mt-4">
      <div
        v-for="pillar of questionnaireStore.pillars"
        :key="pillar.name"
        class="column"
      >
        <Pillar
          :name="pillar.name"
          :active="pillar.name === activePillar?.name"
          style="cursor: pointer"
          @click="onSelectPillar(pillar)"
        />
      </div>
    </div>

    <div v-if="activePillar">
      <PillarReferential
        :pillar="activePillar"
        :color="colorClass"
        :markers="markers"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuestionnaireStore } from "~/stores/questionnaireStore"
import { usePageStore } from "~/stores/pageStore"
import { Marker, PillarType } from "~/composables/types"

const questionnaireStore = useQuestionnaireStore()
const pageStore = usePageStore()

if (!questionnaireStore.pillars.length) {
  questionnaireStore.loadQuestionnaireStructure()
}

if (!pageStore.referentialPage.title) {
  pageStore.loadReferentialPage()
}

const activePillar = ref<PillarType>()
const markers = ref<Marker[]>()

const colorClass = computed(() =>
  activePillar.value ? PillarParams[activePillar.value.name].color : ""
)

const onSelectPillar = (pillar) => {
  activePillar.value = pillar
  markers.value = activePillar.value?.markerIds.map(
    (markerId) => questionnaireStore.markerById[markerId]
  )
}
</script>

<style scoped lang="sass">
.buttons .button
  height: fit-content
</style>
