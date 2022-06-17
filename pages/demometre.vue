<template>
  <div>
    <div class="container">
      <section class="columns section">
        <div class="column is-6">
          <div class="pb-2">
            <PageTitle
              :title="pageStore.referentialPage.title"
              :subtitle="pageStore.referentialPage.introduction"
            />
            <RichText :rich-text="pageStore.referentialPage.description" />
          </div>
          <div class="buttons are-normal is-shade-600">
            <!-- TODO : change link to the right page -->
            <nuxt-link
              class="button is-dark is-rounded is-responsive is-outlined is-shade-600"
              to="/"
            >
              <span>Comment on a construit le référentiel</span>

              <span class="icon">
                <icon name="arrow-right-line" size="20" />
              </span>
            </nuxt-link>
          </div>
        </div>
        <div class="column is-5 is-offset-1">
          <Rosette
            center-button-name="Découvrir"
            @center-button-click="onDiscoverButtonClick()"
            @pillar-click="onRosettePillarClicked($event)"
            @marker-click="onRosetteMarkerClicked($event)"
          />
        </div>
      </section>
    </div>

    <div ref="explicationRef" class="has-background-shade-100 scroll">
      <div class="container">
        <PageSection
          v-if="pageStore.referentialPage.pillarBlockTitle"
          :title="pageStore.referentialPage.pillarBlockTitle"
        >
          <div class="column-2">
            <RichText
              :rich-text="pageStore.referentialPage.pillarBlockContent"
            />
            <img
              v-if="pageStore.referentialPage.pillarBlockImageUrl"
              :src="
                MADIA_BASE_URL + pageStore.referentialPage.pillarBlockImageUrl
              "
              alt="image des piliers"
              :style="`max-height: 250px`"
            />
          </div>
        </PageSection>
        <PageSection
          v-if="pageStore.referentialPage.markerBlockTitle"
          :title="pageStore.referentialPage.markerBlockTitle"
        >
          <div class="column-2">
            <RichText
              :rich-text="pageStore.referentialPage.markerBlockContent"
            />
            <RosetteCooperation />
          </div>
        </PageSection>

        <PageSection
          v-if="pageStore.referentialPage.criteriaBlockTitle"
          :title="pageStore.referentialPage.criteriaBlockTitle"
        >
          <div class="column-2">
            <RichText
              :rich-text="pageStore.referentialPage.criteriaBlockContent"
            />
          </div>
        </PageSection>
      </div>
    </div>

    <div class="container">
      <section ref="pillarsRef" class="columns is-multiline mt-4">
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
      </section>
    </div>

    <div class="container">
      <section v-if="activePillar">
        <PillarReferential
          :pillar="activePillar"
          :color="colorClass"
          :markers="markers"
        />
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router"
import { ref, onMounted } from "vue"
import { useQuestionnaireStore } from "~/stores/questionnaireStore"
import { usePageStore } from "~/stores/pageStore"
import { Marker, PillarType } from "~/composables/types"
import { MADIA_BASE_URL } from "~/composables/api"

definePageMeta({
  title: "DemoMètre",
  breadcrumb: "DemoMètre",
})

const router = useRouter()

const questionnaireStore = useQuestionnaireStore()
const pageStore = usePageStore()

if (!pageStore.referentialPage.title) {
  pageStore.getReferentialPage()
}

const activePillar = ref<PillarType>()
const markers = ref<Marker[]>()

const colorClass = computed(() =>
  activePillar.value ? PillarParams[activePillar.value.name].color : ""
)

const pillarsRef = ref(null)
const explicationRef = ref(null)
onMounted(() => {
  pillarsRef.value.focus()
  explicationRef.value.focus()
})

const onSelectPillar = (pillar) => {
  activePillar.value = pillar
  markers.value = activePillar.value?.markerIds.map(
    (markerId) => questionnaireStore.markerById[markerId]
  )
  router.push({ query: { pillar: pillar.name } })
}

const onDiscoverButtonClick = () => {
  explicationRef.value.scrollIntoView({ behavior: "smooth" })
}
const onRosettePillarClicked = (pillarName) => {
  onSelectPillar(questionnaireStore.getPillarByName(pillarName))
  pillarsRef.value.scrollIntoView({ behavior: "smooth" })
}
const onRosetteMarkerClicked = (markerId) => {
  onRosettePillarClicked(questionnaireStore.markerById[markerId].pillarName)
}
</script>

<style scoped lang="sass">
.buttons .button
  height: fit-content
img
  width: 100%
  object-fit: cover
.column-2
  column-count: 2
  column-gap: 4rem
@include touch
  .column-2
    column-count: 1
.scroll
  scroll-margin-top: 5rem
</style>
