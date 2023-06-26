<template>
  <template v-if="assessmentChartData">
    <AnalyticsBooleanQuestionChart
      v-if="question.type === QuestionType.BOOLEAN"
      :data="assessmentChartData"
      :question="question"
      :color="color"
    ></AnalyticsBooleanQuestionChart>
    <AnalyticsObjectiveChoiceQuestionChart
      v-if="
        question.type === QuestionType.UNIQUE_CHOICE &&
        question.objectivity === Objectivity.OBJECTIVE
      "
      :data="assessmentChartData"
      :color="color"
    ></AnalyticsObjectiveChoiceQuestionChart>
    <AnalyticsChoiceQuestionChart
      v-else-if="
        [QuestionType.UNIQUE_CHOICE, QuestionType.MULTIPLE_CHOICE].includes(
          question.type
        )
      "
      :data="assessmentChartData"
      :color="color"
      :question="question"
    ></AnalyticsChoiceQuestionChart>
    <AnalyticsPercentageQuestionChart
      v-else-if="question.type === QuestionType.PERCENTAGE"
      :data="assessmentChartData"
      :color="color"
    ></AnalyticsPercentageQuestionChart>
    <AnalyticsScaleQuestionChart
      v-else-if="question.type === QuestionType.CLOSED_WITH_SCALE"
      :data="assessmentChartData"
      :color="color"
      :question="question"
    ></AnalyticsScaleQuestionChart>
    <AnalyticsObjectiveNumberQuestion
      v-if="
        question.type === QuestionType.NUMBER &&
        question.objectivity === Objectivity.OBJECTIVE
      "
      :question="question"
      :data="assessmentChartData"
      :color="color"
    />
  </template>
</template>

<script setup lang="ts">
import { useAssessmentStore } from "~/stores/assessmentStore"
import { QuestionType, Objectivity, Question } from "~/composables/types"
import { PropType } from "vue"

const props = defineProps({
  assessmentId: { type: Number, required: true },
  question: { type: Object as PropType<Question>, required: true },
  color: { type: String, required: true },
})

const assessmentStore = useAssessmentStore()
const assessmentChartData = computed(
  () =>
    assessmentStore.chartDataByAssessmentIdAndQuestionId[props.assessmentId]?.[
      props.question.id
    ]?.data
)
if (!assessmentChartData.value) {
  assessmentStore.getChartDataByAssessmentIdAndQuestionId(
    props.assessmentId,
    props.question.id
  )
}
</script>

<style scoped lang="sass"></style>
