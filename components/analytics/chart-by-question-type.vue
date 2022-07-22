<template>
  <template
    v-if="
      assessmentStore.chartDataByAssessmentIdAndQuestionId[assessmentId]?.[
        question.id
      ]?.data
    "
  >
    <AnalyticsBooleanQuestionChart
      v-if="question.type === QuestionType.BOOLEAN"
      :data="
        assessmentStore.chartDataByAssessmentIdAndQuestionId[assessmentId][
          question.id
        ].data
      "
      :color="color"
    ></AnalyticsBooleanQuestionChart>
  </template>
</template>

<script setup lang="ts">
import { useAssessmentStore } from "~/stores/assessmentStore"
import { QuestionType } from "~/composables/types"

const props = defineProps({
  assessmentId: { type: Number, required: true },
  question: { type: Object, required: true },
  color: { type: String },
})

const assessmentStore = useAssessmentStore()
assessmentStore.getChartDataByAssessmentIdAndQuestionId(
  props.assessmentId,
  props.question.id
)
</script>

<style scoped lang="sass"></style>
