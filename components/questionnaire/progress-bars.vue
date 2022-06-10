<template>
  <div :class="{ container: !props.header }">
    <div :class="props.header ? ' m-0' : ''" class="columns">
      <div
        v-for="pillarName in PillarName"
        :key="pillarName"
        class="is-clickable column p-0"
        :class="
          (!props.header && pillarName === hoverPillarName
            ? `has-background-${PillarParams[pillarName].color}-light-hover`
            : `has-background-${PillarParams[pillarName].color}-light`) +
          (props.header ? '' : ' m-0_75 box-rounded')
        "
        style="flex: 1"
        @click.prevent="goToFirstQuestionPillar(pillarName)"
        @mouseenter="hoverPillarName = pillarName"
        @mouseleave="hoverPillarName = null"
      >
        <div
          class="progress-bar-container columns"
          :class="
            props.header
              ? 'mx-0_75 my-0_5'
              : 'is-multiline mt-0_75 mb-1_5 mx-1_5'
          "
        >
          <icon
            size="30"
            :name="pillarName"
            class="mr-1 column is-narrow p-0"
            style="overflow: overlay"
            :color="`${PillarParams[pillarName].color}-dark`"
          />
          <div
            v-if="pillarName === hoverPillarName || !props.header"
            :class="
              `progress-bar-hover has-text-${PillarParams[pillarName].color}-dark column ` +
              (props.header ? 'p-0' : '')
            "
          >
            <span>{{ wordTitleCase(pillarName) }}</span>
            <span
              >{{ getNbAnsweredQuestions(pillarName) }}/{{
                getTotalQuestions(pillarName)
              }}</span
            >
          </div>
          <div
            v-if="pillarName !== hoverPillarName || !props.header"
            class="progress-bar"
          >
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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuestionnaireJourney } from "~/composables/journey"
import { useParticipationStore } from "~/stores/participationStore"
import { PillarName, PillarParams } from "~/composables/types"
import { wordTitleCase } from "~/utils/title-case"

const props = defineProps({
  header: { type: Boolean, default: false },
})

const participationStore = useParticipationStore()

if (
  Object.keys(participationStore.totalAndAnsweredQuestionsByPillarName)
    .length !== 4
) {
  participationStore.setTotalAndAnsweredQuestionsByPillarName()
}

const hoverPillarName = ref<string>()

const goToFirstQuestionPillar = (pillarName) => {
  useQuestionnaireJourney(pillarName).goToNextQuestion(undefined)
}

function getTotalQuestions(pillarName) {
  return participationStore.totalAndAnsweredQuestionsByPillarName[pillarName]
    .total
}

function getNbAnsweredQuestions(pillarName) {
  return participationStore.totalAndAnsweredQuestionsByPillarName[pillarName]
    .answered
}

function getWidth(pillarName) {
  return (
    100 / (getTotalQuestions(pillarName) ? getTotalQuestions(pillarName) : 1)
  )
}
</script>

<style scoped lang="sass">
.progress
  &-bar-container
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
.box-rounded
  border-radius: 6px
</style>
