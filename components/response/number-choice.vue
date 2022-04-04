<template>
  <label>
    <ResponseChoice
      :response-choice="responseChoice"
      :response-choice-index="responseChoice.id"
      :color="props.color"
      hide-left-symbol
    >
      <template #right-symbol>
        <input
          v-model="answer"
          type="number"
          :min="props.bounds.min.value"
          :max="props.bounds.max.value"
        />
        <!-- TODO slider here https://wikiki.github.io/form/slider/ -->
      </template>
    </ResponseChoice>
  </label>
</template>

<script setup lang="ts">
import { PropType } from "vue"
import {
  Category,
  QuestionBounds,
  ResponseChoice as ResponseChoiceType,
} from "~/composables/types"
import { useModel } from "~/composables/modelWrapper"

const props = defineProps({
  category: {
    type: Object as PropType<Category>,
    required: true,
  },
  modelValue: { type: Number, default: null },
  color: { type: String, required: true },
  bounds: { type: Object as PropType<QuestionBounds> },
})

const answer = useModel("modelValue")
const responseChoice = computed<ResponseChoiceType>(() => {
  return {
    id: props.category.id,
    responseChoice: props.category.category,
    description: "",
  }
})
</script>
