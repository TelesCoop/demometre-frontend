<template>
  <div>
    <div style="margin: auto; max-width: 1200px; padding-top: 100px">
      <div style="display: flex">
        <Pillar
          v-for="pillar of questionnaireStore.pillars"
          :key="pillar.name"
          :name="pillar.name"
          :active="pillar.name === activePillar?.name"
          style="cursor: pointer"
          @click="onSelectPillar(pillar)"
        />
      </div>
    </div>

    <div
      v-if="activePillar"
      style="display: flex; flex-direction: row; align-items: flex-start"
    >
      <aside class="menu" style="flex: 5">
        <div class="tabs">
          <ul>
            <li class="is-active"><a>Marqueurs</a></li>
          </ul>
        </div>
        <ul class="menu-list">
          <li
            v-for="marker of markers"
            :key="marker.id"
            :class="marker.name === activeMarker?.name ? 'is-active' : ''"
          >
            <a @click="onSelectMarker(marker)">{{ marker.name }}</a>
            <div v-if="activeMarker">
              <ul>
                <li v-for="criteria of criterias" :key="criteria.id">
                  <a>{{ criteria.name }}</a>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </aside>
      <div class="content" style="flex: 8">
        <div v-if="activeMarker">
          <header>
            <p>{{ activeMarker.name }}</p>
            <p>{{ activeMarker.description }}</p>
          </header>
          <div class="score">
            {{ activeMarker.score1 }}
            {{ activeMarker.score2 }}
            {{ activeMarker.score3 }}
            {{ activeMarker.score4 }}
          </div>
        </div>
        <div v-else>
          <h2 class="title is-2">{{ title }}</h2>
          <p>{{ activePillar.description }}</p>
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

const title = computed<String>(() =>
  activePillar.value ? wordTitleCase(activePillar.value.name) : ""
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
