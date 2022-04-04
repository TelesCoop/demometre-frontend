<template>
  <label class="number-choice">
    <ResponseChoice
      :response-choice="responseChoice"
      :response-choice-index="responseChoice.id"
      :color="props.color"
      :selected="props.selected"
      hide-left-symbol
    >
      <template #right-symbol>
        <div class="is-flex input-container">
          <Slider
            v-model="answer"
            class="choice-slider"
            :min="props.bounds.min.value"
            :max="props.bounds.max.value"
            :tooltips="false"
          />
          <div class="value-display">{{ props.selected ? answer : "?" }}</div>
        </div>
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
import Slider from "@vueform/slider"

const props = defineProps({
  category: {
    type: Object as PropType<Category>,
    required: true,
  },
  modelValue: { type: Number, default: null },
  color: { type: String, required: true },
  bounds: { type: Object as PropType<QuestionBounds>, required: true },
  selected: { type: Boolean, default: false },
})

const answer = useModel<number>("modelValue")
const responseChoice = computed<ResponseChoiceType>(() => {
  return {
    id: props.category.id,
    responseChoice: props.category.category,
    description: "",
  }
})
</script>

<style src="@vueform/slider/themes/default.css"></style>

<style lang="sass">
.number-choice .input-container
  width: 168px
  justify-content: space-between
  align-items: center
  .choice-slider
    --slider-bg: #FFF
    --slider-connect-bg: var(--color)
    --slider-handle-shadow: 0
    --slider-handle-shadow-active: 0
    --slider-handle-border: 1px solid var(--color-dark)
    --slider-handle-width: 18px
    --slider-handle-height: 18px
    --slider-handle-bg: var(--color)
    --slider-height: 12px
    width: 138px

    // customization not planned by the module
    .slider-base, .slider-connects
      border: 1px solid var(--color)
      box-sizing: content-box

    &.slider-horizontal .slider-handle
      top: calc(var(--slider-handle-height, 16px)/2*-1 - var(--slider-height, 6px)/2*-1)
    // end of customization not planned by the module

    .value-display
      margin-top: -2px
</style>
