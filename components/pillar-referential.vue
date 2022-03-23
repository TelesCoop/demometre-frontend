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
              >{{ marker.concatenatedCode }}</span
            >
            {{ wordTitleCase(marker.name) }}</a
          >
          <div v-if="activeMarker">
            <ul>
              <li v-for="criteria of criterias" :key="criteria.id">
                <a style="pointer-events: none"
                  ><span :class="`has-text-${color} is-size-7`">{{
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
    <div class="content column is-7 my-1_5">
      <div v-if="activeMarker">
        <header>
          <h2 class="title is-4">{{ markerTitle }}</h2>
          <RichText
            v-if="activeMarker.description"
            :rich-text="activeMarker.description"
            class="is-family-secondary"
          />
        </header>
        <hr />
        <div class="score">
          <div v-for="i in 4" :key="i" class="level">
            <div class="level-left">
              <Score :score="i" :color="color" class="level-item mr-1_5" />
              <p class="level-item">
                {{ wordTitleCase(activeMarker["score" + i]) }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <h2 class="title is-3">{{ wordTitleCase(pillar.name) }}</h2>
        <RichText
          v-if="pillar.description"
          :rich-text="pillar.description"
          class="is-family-secondary"
        />
        <div class="buttons are-small mt-2">
          <!-- TODO : change button links -->
          <nuxt-link
            :class="`button is-${color} is-rounded is-responsive`"
            to="/"
          >
            <span>Evaluer ce pilier</span>
            <span class="icon">
              <icon
                name="arrow-right-line"
                height="10"
                width="10"
                class="icon"
              />
            </span>
          </nuxt-link>
          <nuxt-link
            :class="`button
                is-${color} is-rounded is-responsive is-outlined`"
            to="/resultats"
            style="display: none"
          >
            Visualiser les résultats de ce pilier
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"

import { wordTitleCase } from "~/utils"
import { useQuestionnaireStore } from "~/stores/questionnaireStore"
import { Marker, Criteria } from "~/composables/types"

const questionnaireStore = useQuestionnaireStore()

const props = defineProps({
  pillar: { type: Object, require: true },
  color: { type: String, required: true },
  markers: { type: Array, required: false },
})

const activeMarker = ref<Marker>()
const criterias = ref<Criteria[]>()
const hoverMarkerId = ref<number>()

const markerTitle = computed<string>(() =>
  activeMarker.value ? wordTitleCase(activeMarker.value.name) : ""
)

watch(
  () => props.markers,
  () => {
    activeMarker.value = null
  }
)

const onSelectMarker = (marker) => {
  activeMarker.value = marker
  criterias.value = activeMarker.value.criteriaIds.map(
    (criteriaId) => questionnaireStore.criteriaById[criteriaId]
  )
}

const activeMarkerClass = computed(() => {
  return `has-background-${props.color} has-text-white`
})

const hoverMarkerClass = computed(() => {
  return `has-background-${props.color}-light has-text-black`
})
</script>
