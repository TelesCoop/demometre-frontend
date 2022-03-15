<template>
  <div style="margin: auto; max-width: 1200px; padding-top: 100px">
    <!-- <div style="display: flex">
      <Pillar
        v-for="pillar of Object.values(questionnaireStore.pillarByName)"
        :key="pillar.name"
        :name="pillar.name"
        :isActive="pillar.name === activePillar?.name || ''"
        style="cursor: pointer"
        @click="activePillar = pillar"
      />
    </div> -->
  </div>
  <h2 class="title is-2">{{ title }}</h2>
  <!-- <div>
    <aside class="menu">
      <p class="menu-label">Marqueurs</p>
      <ul class="menu-list">
        <li v-for="markerId of activePillar?.markers || []" :key="markerId">
          <a>{{
            questionnaireStore.markerById[markerId]?.name || "MARCHE PAAAAAS"
          }}</a>
        </li>
      </ul>
    </aside>
  </div> -->
</template>

<script setup lang="ts">
import { wordTitleCase } from "~/utils"
import { useQuestionnaireStore } from "~/stores/questionnaireStore"
import { Pillar, PillarList } from "~~/composables/types"
import { Ref } from "vue"

const questionnaireStore = useQuestionnaireStore()

if (!Object.keys(questionnaireStore.questionById).length) {
  questionnaireStore.loadQuestionnaire()
}

console.log({ ...questionnaireStore.questionById })
console.log(questionnaireStore.questionById)
console.log({ ...questionnaireStore.pillarByName[PillarList.REPRESENTATION] })

console.log("CCCCCCCc")
console.log(questionnaireStore.getPillarByName(PillarList.REPRESENTATION))

const activePillar = ref<Pillar>(
  questionnaireStore.pillarByName[PillarList.REPRESENTATION]
)

console.log(activePillar)

console.log(activePillar.value)

// console.log(activePillar.value.name)

// const activePillar: Ref<Pillar> =
//   questionnaireStore.pillarByName[PillarList.REPRESENTATION]
console.log(activePillar)
const title = computed<String>(() =>
  activePillar ? wordTitleCase(activePillar.value.name) : ""
)
console.log("LE TITRE : ")
console.log(title)

const activeMarker = ref("")
</script>
