<template>
  <div class="container">
    <section class="columns section">
      <div class="column is-6">
        <PageTitle
          :title="pageStore.referentialPage.title"
          :subtitle="pageStore.referentialPage.introduction"
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
      <div class="column is-5 is-offset-1">
        <Rosette
          center-button-name="Découvrir"
          @center-button-click="onDiscoverButtonClick()"
          @pillar-click="onRosettePillarClicked($event)"
          @marker-click="onRosetteMarkerClicked($event)"
        />
      </div>
    </section>

    <section class="container has-background-shade-100 m-0">
      <div v-if="pageStore.referentialPage.pillarBlockTitle">
        <PageSection :title="pageStore.referentialPage.pillarBlockTitle">
          <div>
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
      </div>
      <div v-if="pageStore.referentialPage.markerBlockTitle">
        <PageSection :title="pageStore.referentialPage.markerBlockTitle">
          <div class="columns">
            <RichText
              :rich-text="pageStore.referentialPage.markerBlockContent"
            />

            <!-- L'emplacement de la partie de la rosette -->

            <RosettePart
              pillar-name="cooperation"
              @pillar-click="onRosettePillarClicked($event)"
              @marker-click="onRosetteMarkerClicked($event)"
            />

            <!-- <div
              :key="questionnaireStore.pillarByName.cooperation"
              :class="`pillar-container-${
                PillarParams[questionnaireStore.pillarByName.cooperation].key
              } has-text-${PillarParams[questionnaireStore.pillarByName.cooperation].color}-dark`"
            >
              <div
                :class="
                  `pillar-circle-${PillarParams[questionnaireStore.pillarByName.cooperation].key}
                    has-border-${PillarParams[questionnaireStore.pillarByName.cooperation].color}
              ` +
                  (pillar.id === hoverPillarId ||
                  pillar.markerIds.includes(hoverMarkerId)
                    ? `has-background-${PillarParams[questionnaireStore.pillarByName.cooperation].color}`
                    : `has-background-${PillarParams[questionnaireStore.pillarByName.cooperation].color}-light`)
                "
                @mouseenter="hoverPillarId = pillar.id"
                @mouseleave="hoverPillarId = null"
                @click="onRosettePillarClicked(questionnaireStore.pillarByName.cooperation)"
              >
                <div
                  v-if="pillar.markerIds.includes(hoverMarkerId)"
                  class="pillar-marker-title"
                >
                  <span class="is-size-7 has-text-weight-bold">{{
                    questionnaireStore.markerById[hoverMarkerId].name
                  }}</span>
                </div>
                <div v-else>
                  <img
                    :class="`pillar-icon-${PillarParams[questionnaireStore.pillarByName.cooperation].key}`"
                    :src="`/assets/img/${PillarParams[questionnaireStore.pillarByName.cooperation].picto}`"
                  />
                  <span
                    class="
                      pillar-title
                      is-size-7
                      has-text-weight-bold
                      is-capitalized
                    "
                    >{{ questionnaireStore.pillarByName.cooperation }}</span
                  >
                </div>
              </div>

              <div
                v-for="(markerId, index) in pillar.markerIds"
                :key="markerId"
                :class="
                  `
            marker-circle-${PillarParams[pillar.name].key}
            has-border-${PillarParams[pillar.name].color} ` +
                  (markerId === hoverMarkerId
                    ? `has-background-${PillarParams[pillar.name].color}`
                    : ``)
                "
                @mouseenter="hoverMarkerId = markerId"
                @mouseleave="hoverMarkerId = null"
                @click="onRosetteMarkerClicked(markerId)"
              >
                <span class="marker-index is-size-7 has-text-weight-bold">{{
                  index + 1
                }}</span>
              </div>
            </div> -->
          </div>
        </PageSection>
      </div>
      <div v-if="pageStore.referentialPage.criteriaBlockTitle">
        <PageSection :title="pageStore.referentialPage.criteriaBlockTitle">
          <div>
            <RichText
              :rich-text="pageStore.referentialPage.criteriaBlockContent"
            />
          </div>
        </PageSection>
      </div>
    </section>

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

    <section v-if="activePillar">
      <PillarReferential
        :pillar="activePillar"
        :color="colorClass"
        :markers="markers"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router"
import { ref, onMounted } from "vue"
import { useQuestionnaireStore } from "~/stores/questionnaireStore"
import { usePageStore } from "~/stores/pageStore"
import { Marker, PillarType } from "~/composables/types"
import { MADIA_BASE_URL } from "~/composables/api"
// rosette part import
//import { PillarParams } from "~/composables/types"

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

// Rosette part const
// const hoverMarkerId = ref<number>()
// const hoverPillarId = ref<number>()

const colorClass = computed(() =>
  activePillar.value ? PillarParams[activePillar.value.name].color : ""
)

const pillarsRef = ref(null)
onMounted(() => {
  pillarsRef.value.focus()
})

const onSelectPillar = (pillar) => {
  activePillar.value = pillar
  markers.value = activePillar.value?.markerIds.map(
    (markerId) => questionnaireStore.markerById[markerId]
  )
  router.push({ query: { pillar: pillar.name } })
}

const onDiscoverButtonClick = () => {
  // TODO : New section of referential page
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
  width: 50%
  object-fit: cover
</style>
