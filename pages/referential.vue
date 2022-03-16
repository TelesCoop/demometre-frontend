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
import { Marker, PillarType } from "~/composables/types"

const questionnaireStore = useQuestionnaireStore()

if (!Object.keys(questionnaireStore.questionById).length) {
  questionnaireStore.loadQuestionnaire()
}

const activePillar = ref<PillarType>()
const markers = ref<Marker[]>()

const colorClass = computed(() =>
  activePillar.value ? PillarStrategy[activePillar.value.name].color : ""
)

const onSelectPillar = (pillar) => {
  activePillar.value = pillar
  markers.value = activePillar.value?.markers.map(
    (markerId) => questionnaireStore.markerById[markerId]
  )
}
</script>
