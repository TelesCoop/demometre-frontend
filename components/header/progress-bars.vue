<template>
  <div class="progress-header">
    <router-link
      v-for="pillarName in PillarName"
      :key="pillarName"
      :class="`has-background-${PillarParams[pillarName].color}-light px-0_75 py-0_5`"
      style="flex: 1"
      :to="firstQuestionPillarLink(pillarName)"
      @mouseenter="hoverPillarName = pillarName"
      @mouseleave="hoverPillarName = null"
    >
      <div class="progress-bar-container">
        <icon
          size="30"
          :name="pillarName"
          class="mr-1"
          style="overflow: overlay"
          :color="`${PillarParams[pillarName].color}-dark`"
        />
        <div
          v-if="pillarName === hoverPillarName"
          :class="`progress-bar-hover has-text-${PillarParams[pillarName].color}-dark`"
        >
          <span>{{ wordTitleCase(pillarName) }}</span>
          <span
            >{{ getNbAnsweredQuestions(pillarName) }}/{{
              getTotalQuestions(pillarName)
            }}</span
          >
        </div>
        <div v-else class="progress-bar">
          <div
            v-for="index in getTotalQuestions(pillarName)"
            :key="index"
            class="progress-bar-link"
            :style="`width: ${getWidth(pillarName)}%;`"
            :class="[
              index <= getNbAnsweredQuestions(pillarName)
                ? `has-background-${PillarParams[pillarName].color}`
                : `has-background-${PillarParams[pillarName].color}-light-active`,
              index === getNbAnsweredQuestions(pillarName) &&
                getNbAnsweredQuestions(pillarName) !==
                  getTotalQuestions(pillarName) &&
                ' last-complete',
              index === getTotalQuestions(pillarName) && ' all-completed',
              index === 1 && ' one-completed',
            ]"
          ></div>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { useParticipationStore } from "~/stores/participationStore"
import { PillarName, PillarParams } from "~/composables/types"
import { wordTitleCase } from "~/utils/title-case"
import { useQuestionnaireStore } from "~/stores/questionnaireStore"
import { useUserStore } from "~/stores/userStore"

const userStore = useUserStore()
const questionnaireStore = useQuestionnaireStore()
const participationStore = useParticipationStore()

if (
  !Object.keys(participationStore.totalAndAnsweredQuestionsByPillarName).length
) {
  participationStore.setTotalAndAnsweredQuestionsByPillarName()
}

const hoverPillarName = ref<string>()

const firstQuestionPillarLink = (pillarName) => {
  const firstQuestion =
    questionnaireStore.getQuestionnaireQuestionByPillarName(pillarName)[0]
  return {
    path: `/evaluation/questionnaire/${firstQuestion?.id}`,
    query: { pillar: pillarName, anonymous: userStore.anonymous.username },
  }
}

function getTotalQuestions(pillarName) {
  return participationStore.totalAndAnsweredQuestionsByPillarName[pillarName]
    .total
}

function getNbAnsweredQuestions(pillarName) {
  return participationStore.totalAndAnsweredQuestionsByPillarName[pillarName]
    .answered
}

// const dataByPillarName = ref(getDataByPillarName())
function getWidth(pillarName) {
  return (
    100 / (getTotalQuestions(pillarName) ? getTotalQuestions(pillarName) : 1)
  )
}

// function getDataByPillarName() {
//   const data = {}
//   for (let pillarName in PillarName) {
//     const totalAndAnsweredInPillar =
//       participationStore.getTotalQuestionsAndAnsweredQuestionsInPillar(
//         PillarName[pillarName]
//       )
//     data[PillarName[pillarName]] = {
//       ...totalAndAnsweredInPillar,
//       width:
//         100 /
//         (totalAndAnsweredInPillar.total ? totalAndAnsweredInPillar.total : 1),
//     }
//   }
//   console.log(data)
//   return data
// }
</script>

<style scoped lang="sass">
.progress
    &-header
        display: flex
        width: 100%
    &-bar-container
        display: flex
        align-items: center
    &-bar-hover
        display: flex
        justify-content: space-between
        width: 100%
    &-bar
        display: flex
        height: 12px
        max-height: 12px
        width: 100%
        border: 1px solid $shade-600
        border-radius: 20px
        cursor: pointer

        &-link
            height: 100%

        .last-complete
            border-right: 1px solid $shade-600
        .one-completed
            border-top-left-radius: 20px
            border-bottom-left-radius: 20px
        .all-completed
            border-top-right-radius: 20px
            border-bottom-right-radius: 20px
</style>
