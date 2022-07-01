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
              marker === activeMarker && !activeCriteria
                ? activeClass
                : marker.id === hoverMarkerId
                ? hoverMarkerClass
                : `has-text-${color}-dark`
            "
            @click="onSelectMarker(marker)"
            @mouseenter="hoverMarkerId = marker.id"
            @mouseleave="hoverMarkerId = null"
            ><span
              :class="
                marker.name === activeMarker?.name && !activeCriteria
                  ? `has-text-${color}-active is-size-6bis`
                  : `has-text-${color} is-size-6bis`
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
                      ? activeClass
                      : criteria.id === hoverCriteriaId
                      ? hoverCriteriaClass
                      : ''
                  "
                  @click="onSelectCriteria(criteria)"
                  @mouseenter="hoverCriteriaId = criteria.id"
                  @mouseleave="hoverCriteriaId = null"
                  ><span
                    :class="
                      criteria.name === activeCriteria?.name
                        ? `has-text-${color}-active is-size-6bis`
                        : `has-text-${color} is-size-6bis`
                    "
                    >{{
                      criteria.concatenatedCode.substring(1).replace(/^\./, "")
                    }}</span
                  >
                  {{ criteria.name }}</a
                >
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </aside>
    <div class="content column is-7">
      <div v-if="activeCriteria">
        <header>
          <h2 class="title is-4 mb-0_75">{{ criteriaTitle }}</h2>
          <hr class="my-0_75" />
          <Accordion
            v-if="activeCriteria.definitionIds.length"
            id="definitions"
          >
            <template #title>
              <h3 class="subtitle has-text-weight-bold mb-1">Definitions</h3>
            </template>
            <template #content>
              <div
                v-for="definitionId of activeCriteria.definitionIds"
                :key="definitionId"
              >
                <p class="has-text-weight-bold">
                  {{ definitionStore.definitionById[definitionId].word }}
                </p>
                <RichText
                  :rich-text="
                    definitionStore.definitionById[definitionId].explanation
                  "
                  class="is-family-secondary"
                />
              </div>
            </template>
          </Accordion>
          <template v-if="activeCriteria.explanatory">
            <Accordion
              v-for="explanatory of criteriaExplinatories"
              :id="explanatory.title"
              :key="explanatory.title"
            >
              <template #title>
                <h3 class="subtitle has-text-weight-bold mb-1">
                  {{ explanatory.title }}
                </h3>
              </template>
              <template #content>
                <RichText
                  :rich-text="explanatory.description"
                  class="is-family-secondary"
                />
              </template>
            </Accordion>
          </template>
        </header>
        <div>
          <button
            :class="`button is-${color} is-rounded is-responsive`"
            @click="onReturnToMarkerButtonClick()"
          >
            <span>Revenir au marqueur</span>
          </button>
        </div>
      </div>
      <div v-else-if="activeMarker">
        <header>
          <h2 class="title is-4 mb-0_75">{{ markerTitle }}</h2>
          <hr class="my-0_75" />
          <RichText
            v-if="activeMarker.description"
            :rich-text="activeMarker.description"
            class="is-family-secondary subtitle mb-2"
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
            :class="`button is-${color} is-rounded is-responsive mt-2 mr-1`"
            @click="onReturnToPillarButtonClick()"
          >
            <span>Revenir au pilier</span>
          </button>
          <button
            :class="`button is-${color} is-rounded is-responsive mt-2 mr-1 is-outlined`"
            @click="onFirstCriteriaButtonClick()"
          >
            <span>Premier critère</span>
            <span class="icon">
              <icon name="arrow-right-line" size="10" class="icon" />
            </span>
          </button>
        </div>
      </div>
      <div v-else>
        <h2 class="title is-4 mb-0_75">{{ wordTitleCase(pillar.name) }}</h2>
        <hr class="my-0_75" />
        <RichText
          v-if="pillar.description"
          :rich-text="pillar.description"
          class="is-family-secondary subtitle mb-2"
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

const activeClass = computed(() => {
  return `has-background-${props.color} has-text-${props.color}-dark`
})

const hoverMarkerClass = computed(() => {
  return `has-background-${props.color}-light has-text-black`
})
const hoverCriteriaClass = computed(() => {
  return `has-background-${props.color}-light has-text-black`
})

const onFirstMarkerButtonClick = () => {
  const firstMarker = props.markers[0]
  onSelectMarker(firstMarker)
}
const onFirstCriteriaButtonClick = () => {
  const firstCriteria = criterias.value[0]
  onSelectCriteria(firstCriteria)
}

const onReturnToPillarButtonClick = () => {
  activeMarker.value = null
}
const onReturnToMarkerButtonClick = () => {
  activeCriteria.value = null
}
</script>
