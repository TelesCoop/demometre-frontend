<template>
  <div class="control has-icons-right percentage ml-0_5 mb-4">
    <input
      :id="`$question-${props.questionId}-percentage`"
      v-model="answer"
      type="number"
      min="0"
      max="100"
      class="input has-text-grey-dark"
      :class="`has-background-${props.color}-light has-border-${props.color}-dark`"
      placeholder="50"
    />
    <i class="icon is-small is-right has-text-grey-dark">
      <span>%</span>
    </i>
  </div>
</template>

<script setup lang="ts">
import { useModel } from "~/composables/modelWrapper"

const props = defineProps({
  color: { type: String, required: true },
  modelValue: { required: true },
  questionId: { required: true, type: Number },
})

const answer = useModel("modelValue")
</script>

<style scoped lang="sass">
.percentage
  width: min-content
  min-width: 6rem
</style>
