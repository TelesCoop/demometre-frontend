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
          >
            <span
              :class="
                marker.name === activeMarker?.name && !activeCriteria
                  ? `has-text-${color}-active is-size-6bis`
                  : `has-text-${color} is-size-6bis`
              "
              >{{
                getConcatenedCodeWithoutPillar(marker.concatenatedCode)
              }}</span
            >
            {{ wordTitleCase(marker.name) }}
          </a>
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
                >
                  <span
                    :class="
                      criteria.name === activeCriteria?.name
                        ? `has-text-${color}-active is-size-6bis`
                        : `has-text-${color} is-size-6bis`
                    "
                  >
                    {{
                      getConcatenedCodeWithoutPillar(criteria.concatenatedCode)
                    }}
                  </span>
                  {{ criteria.name }}
                </a>
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
        </header>
        <slot name="criteria" :criteria="activeCriteria"></slot>
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
        </header>
        <slot name="marker" :marker="activeMarker"></slot>
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

const questionnaireStore = useQuestionnaireStore()

const props = defineProps({
  pillar: { type: Object, required: true },
  color: { type: String, required: true },
  markers: { type: Array, required: false },
  initialQuestionId: {
    type: Number,
    required: false,
    default: undefined,
  },
})
const getCriteriasOfActiveMarker = () => {
  return activeMarker.value?.criteriaIds.map(
    (criteriaId) => questionnaireStore.criteriaById[criteriaId]
  )
}

const initialActiveCriteria =
  questionnaireStore.criteriaById[
    questionnaireStore.questionById[props.initialQuestionId]?.criteriaId
  ]
const activeCriteria = ref<Criteria>(initialActiveCriteria)
const activeMarker = ref<Marker>(
  questionnaireStore.markerById[activeCriteria.value?.markerId]
)
const criterias = ref<Criteria[]>(getCriteriasOfActiveMarker())
const hoverMarkerId = ref<number>()
const hoverCriteriaId = ref<number>()

const markerTitle = computed<string>(() =>
  activeMarker.value ? wordTitleCase(activeMarker.value.name) : ""
)
const criteriaTitle = computed<string>(() =>
  activeCriteria.value ? wordTitleCase(activeCriteria.value.name) : ""
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
  criterias.value = getCriteriasOfActiveMarker()
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

const getConcatenedCodeWithoutPillar = (code) => {
  return code.substring(1).replace(/^\./, "")
}

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
