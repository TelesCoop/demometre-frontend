<template>
  <div>
    <div class="mb-1">
      <ResponseInputNumber
        :model-value="data.value"
        :color="props.color"
        :question-id="question.id"
        :min="question.minNumberValue"
        :max="question.maxNumberValue"
        :step="question.stepNumberValue"
        :read-only="true"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from "vue"
import { Question } from "~/composables/types"

const props = defineProps({
  question: { type: Object as PropType<Question>, required: true },
  data: { type: Object as PropType<{ value: number }>, required: true },
  color: { type: String, required: true },
})
</script>

<style scoped lang="sass"></style>
