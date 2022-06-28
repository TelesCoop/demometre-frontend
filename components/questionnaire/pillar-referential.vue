<template>
  <div class="columns">
    <aside class="menu column is-5 mr-2">
      <div class="tabs">
        <ul>
          <li class="is-active">
            <a
              :class="`has-text-${color}`"
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
              marker === activeMarker
                ? activeMarkerClass
                : marker.id === hoverMarkerId
                ? hoverMarkerClass
                : ''
            "
            @click="onSelectMarker(marker)"
            @mouseenter="hoverMarkerId = marker.id"
            @mouseleave="hoverMarkerId = null"
            ><span
              :class="
                marker.name === activeMarker?.name
                  ? `has-text-white is-size-7`
                  : `has-text-${color} is-size-7`
              "
              >{{
                marker.concatenatedCode.substring(1).replace(/^\./, "")
              }}</span
            >
            {{ wordTitleCase(marker.name) }}</a
          >
          <div v-if="marker.name === activeMarker?.name">
            <ul>
              <li v-for="criteria of criterias" :key="criteria.id">
                <a
                  :class="
                    criteria === activeCriteria
                      ? activeCriteriaClass
                      : criteria.id === hoverCriteriaId
                      ? hoverCriteriaClass
                      : ''
                  "
                  @click="onSelectCriteria(criteria)"
                  @mouseenter="hoverCriteriaId = criteria.id"
                  @mouseleave="hoverCriteriaId = null"
                  ><span :class="`has-text-${color} is-size-7`">{{
                    criteria.concatenatedCode.substring(1).replace(/^\./, "")
                  }}</span>
                  {{ criteria.name }}</a
                >
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </aside>
    <div class="content column is-7">
      <!-- v-if activ criteria -->
      <div v-if="activeCriteria">
        <header>
          <h2 class="title is-4">{{ criteriaTitle }}</h2>
          <hr />
          <div v-if="activeCriteria.definitionIds">
            <div
              v-for="definitionId of activeCriteria.definitionIds"
              :key="definitionId"
            >
              <h3>{{ definitionStore.definitionById[definitionId].word }}</h3>
              <RichText
                :rich-text="
                  definitionStore.definitionById[definitionId].explanation
                "
                class="is-family-secondary"
              />
            </div>
          </div>
          <div v-if="activeCriteria.explanatory">
            <div
              v-for="explanatory of criteriaExplinatories"
              :key="explanatory"
            >
              <h3>{{ explanatory.title }}</h3>
              <RichText
                :rich-text="explanatory.description"
                class="is-family-secondary"
              />
            </div>
          </div>
        </header>
      </div>
      <!-- Changer en v-else-if activeMarker -->
      <div v-else-if="activeMarker">
        <header>
          <h2 class="title is-4">{{ markerTitle }}</h2>
          <hr />
          <RichText
            v-if="activeMarker.description"
            :rich-text="activeMarker.description"
            class="is-family-secondary"
          />
        </header>
        <div class="score">
          <div v-for="i in 4" :key="i" class="level">
            <div class="level-left">
              <AnalyticsScore
                :score="i"
                :color="color"
                class="level-item mr-1_5"
              />
              <p class="level-item">
                {{ wordTitleCase(activeMarker["score" + i]) }}
              </p>
            </div>
          </div>
        </div>
        <div>
          <button
            :class="`button is-${color} is-rounded is-responsive`"
            @click="onReturnToPillarButtonClick()"
          >
            <span>Revenir au pilier</span>
          </button>
        </div>
      </div>
      <div v-else>
        <h2 class="title is-3">{{ wordTitleCase(pillar.name) }}</h2>
        <RichText
          v-if="pillar.description"
          :rich-text="pillar.description"
          class="is-family-secondary"
        />
        <div>
          <button
            :class="`button is-${color} is-rounded is-responsive is-outlined`"
            @click="onFirstMarkerButtonClick()"
          >
            <span>Premier marqueur</span>
            <span class="icon">
              <icon name="arrow-right-line" size="10" class="icon" />
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"

import { wordTitleCase } from "~/utils/util"
import { useQuestionnaireStore } from "~/stores/questionnaireStore"
import { Marker, Criteria } from "~/composables/types"
import { useDefinitionStore } from "~~/stores/definitionStore"

const questionnaireStore = useQuestionnaireStore()
const definitionStore = useDefinitionStore()

const props = defineProps({
  pillar: { type: Object, required: true },
  color: { type: String, required: true },
  markers: { type: Array, required: false },
})

const activeMarker = ref<Marker>()
const criterias = ref<Criteria[]>()
const activeCriteria = ref<Criteria>()
const hoverMarkerId = ref<number>()
const hoverCriteriaId = ref<number>()

const markerTitle = computed<string>(() =>
  activeMarker.value ? wordTitleCase(activeMarker.value.name) : ""
)
const criteriaTitle = computed<string>(() =>
  activeCriteria.value ? wordTitleCase(activeCriteria.value.name) : ""
)

const criteriaExplinatories = computed(() =>
  activeCriteria.value ? activeCriteria.value.explanatory : []
)

watch(
  () => props.markers,
  () => {
    activeMarker.value = null
    activeCriteria.value = null
  }
)

const onSelectMarker = (marker) => {
  activeMarker.value = marker
  criterias.value = activeMarker.value.criteriaIds.map(
    (criteriaId) => questionnaireStore.criteriaById[criteriaId]
  )
  activeCriteria.value = null
}
const onSelectCriteria = (criteria) => {
  activeCriteria.value = criteria
}

const activeMarkerClass = computed(() => {
  return `has-background-${props.color} has-text-white`
})
const activeCriteriaClass = computed(() => {
  // Check style maquette
  return `has-background-${props.color} has-text-white`
})

const hoverMarkerClass = computed(() => {
  return `has-background-${props.color}-light has-text-black`
})
const hoverCriteriaClass = computed(() => {
  // Check style maquette
  return `has-background-${props.color}-light has-text-black`
})

const onFirstMarkerButtonClick = () => {
  const firstMarker = props.markers[0]
  onSelectMarker(firstMarker)
}

const onReturnToPillarButtonClick = () => {
  activeMarker.value = null
}
</script>
