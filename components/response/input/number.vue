<template>
  <div class="control number ml-0_5 mb-4">
    <input
      :id="`$question-${props.questionId}-number`"
      v-model="answer"
      type="number"
      :min="min"
      :max="max"
      :step="step"
      class="input"
      :class="`has-background-${props.color}-light has-border-${props.color}-dark has-text-${props.color}-dark`"
    />
  </div>
</template>

<script setup lang="ts">
import { useModel } from "~/composables/modelWrapper"

const props = defineProps({
  color: { type: String, required: true },
  modelValue: { required: true },
  questionId: { required: true, type: Number },
  min: { type: Number },
  max: { type: Number },
  step: { type: Number, required: true },
})

const answer = useModel("modelValue")
</script>

<style scoped lang="sass">
.number
  width: min-content
  min-width: 10rem
</style>
