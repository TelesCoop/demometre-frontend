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
          @click="activePillar = pillar"
        />
      </div>
    </div>

    <h2 class="title is-2">{{ title }}</h2>
    <div v-if="activePillar">
      <aside class="menu">
        <p class="menu-label">Marqueurs</p>
        <ul class="menu-list">
          <li v-for="markerId of activePillar.markers" :key="markerId">
            <a>{{ questionnaireStore.markerById[markerId].name }}</a>
          </li>
        </ul>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { wordTitleCase } from "~/utils"
import { useQuestionnaireStore } from "~/stores/questionnaireStore"
import { PillarType } from "~/composables/types"

const questionnaireStore = useQuestionnaireStore()

if (!Object.keys(questionnaireStore.questionById).length) {
  questionnaireStore.loadQuestionnaire()
}

const activePillar = ref<PillarType>()

const title = computed<String>(() =>
  activePillar.value ? wordTitleCase(activePillar.value.name) : ""
)

const activeMarker = ref("")
</script>
