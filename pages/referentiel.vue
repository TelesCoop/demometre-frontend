<template>
  <div class="container">
    <div class="columns" style="padding-top: 100px">
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

    <div v-if="activePillar" class="columns">
      <aside class="menu column is-5 mr-2rem">
        <div class="tabs">
          <ul>
            <li class="is-active">
              <a
                :class="`has-text-${colorClass}`"
                style="border-bottom-color: currentColor"
                >Marqueurs</a
              >
            </li>
          </ul>
        </div>
        <ul class="menu-list">
          <li v-for="marker of markers" :key="marker.id">
            <a
              :class="
                marker.name === activeMarker?.name
                  ? `has-background-${colorClass} has-text-white`
                  : ''
              "
              @click="onSelectMarker(marker)"
              ><span
                :class="
                  marker.name === activeMarker?.name
                    ? `has-text-white is-size-7`
                    : `has-text-${colorClass} is-size-7`
                "
                >{{ marker.concatenatedCode }}</span
              >
              {{ wordTitleCase(marker.name) }}</a
            >
            <div v-if="activeMarker">
              <ul>
                <li v-for="criteria of criterias" :key="criteria.id">
                  <a style="cursor: unset"
                    ><span :class="`has-text-${colorClass} is-size-7`">{{
                      criteria.concatenatedCode
                    }}</span>
                    {{ criteria.name }}</a
                  >
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </aside>
      <div class="content column is-7 my-5">
        <div v-if="activeMarker">
          <header>
            <h2 class="title is-4">{{ markerTitle }}</h2>
            <span v-html="activeMarker.description"></span>
          </header>
          <hr />
          <div class="score">
            <div v-for="i in 4" :key="i" class="level">
              <div class="level-left">
                <Score :score="i" :color="colorClass" class="level-item mr-5" />
                <p class="level-item">
                  {{ wordTitleCase(activeMarker["score" + i]) }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <h2 class="title is-3">{{ pillarTitle }}</h2>
          <span v-html="activePillar.description"></span>
          <div class="buttons are-small mt-2rem">
            <!-- TODO : change button links -->
            <nuxt-link
              :class="`button is-${colorClass} is-rounded is-responsive`"
              to="/"
            >
              <span>Evaluer ce pilier</span>
              <span class="icon">
                <icon name="arrow-right-line" size="10" class="icon" />
              </span>
            </nuxt-link>
            <nuxt-link
              :class="`button
                is-${colorClass} is-rounded is-responsive is-outlined`"
              to="/resultats"
            >
              Visualiser les résultats de ce pilier
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { wordTitleCase } from "~/utils"
import { useQuestionnaireStore } from "~/stores/questionnaireStore"
import { Criteria, Marker, PillarType } from "~/composables/types"

const questionnaireStore = useQuestionnaireStore()

if (!Object.keys(questionnaireStore.questionById).length) {
  questionnaireStore.loadQuestionnaire()
}

const activePillar = ref<PillarType>()
const markers = ref<Marker[]>()
const activeMarker = ref<Marker>()
const criterias = ref<Criteria[]>()

const pillarTitle = computed<String>(() =>
  activePillar.value ? wordTitleCase(activePillar.value.name) : ""
)
const markerTitle = computed<String>(() =>
  activeMarker.value ? wordTitleCase(activeMarker.value.name) : ""
)
const colorClass = computed(() =>
  activePillar.value ? PillarStrategy[activePillar.value.name].color : ""
)

const onSelectPillar = (pillar) => {
  activePillar.value = pillar
  markers.value = activePillar.value.markers.map(
    (markerId) => questionnaireStore.markerById[markerId]
  )
  activeMarker.value = null
}

const onSelectMarker = (marker) => {
  activeMarker.value = marker
  criterias.value = activeMarker.value.criterias.map(
    (criteriaId) => questionnaireStore.criteriaById[criteriaId]
  )
}
</script>

<style scoped lang="sass">
</style>
