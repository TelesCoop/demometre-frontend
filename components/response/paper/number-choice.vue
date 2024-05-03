<template>
  <div class="paper-number-choice">
    <ResponseChoice
      :response-choice="responseChoice"
      :response-choice-index="responseChoice.id"
      :color="props.color"
      hide-left-symbol
    >
      <template #right-symbol>
        <div class="is-flex ml-3 flex-gap-1">
          <div
            v-for="possibleAnswer in possibleAnwers"
            :key="possibleAnswer"
          >
            <label class="input-choice-letter has-border-shade-800">{{
              possibleAnswer
            }}</label>
          </div>
        </div>
      </template>
    </ResponseChoice>
  </div>
</template>

<script setup lang="ts">
import { PropType } from "vue"
import {
  Category,
  QuestionBounds,
  ResponseChoice as ResponseChoiceType,
} from "~/composables/types"

const props = defineProps({
  category: {
    type: Object as PropType<Category>,
    required: true,
  },
  color: { type: String, required: true },
  bounds: { type: Object as PropType<QuestionBounds>, required: true },
})

const possibleAnwers = computed(() => {
  const answers = []
  for (let i = props.bounds.min; i <= props.bounds.max; i++) {
    answers.push(i)
  }
  return answers
})
const responseChoice = computed<ResponseChoiceType>(() => {
  return {
    id: props.category.id,
    responseChoice: props.category.category,
    description: "",
  }
})
</script>

<style src="@vueform/slider/themes/default.css"></style>

<style lang="sass" scoped>
.paper-number-choice
  .input-choice-letter
    display: inline-block
    width: 40px
    height: 40px
</style>
