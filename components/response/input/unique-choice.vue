<template>
  <fieldset>
    <legend
      class="is-size-6bis mb-0_75 is-block"
      :class="`has-text-${props.color}-dark`"
    >
      <slot name="legend">Choisissez une réponse.</slot>
    </legend>
    <div
      v-for="(responseChoice, responseChoiceIndex) of props.responseChoices"
      :key="responseChoiceIndex"
      class="mb-1"
    >
      <input
        :id="genInputId(responseChoiceIndex)"
        v-model="answer"
        type="radio"
        :name="genInputId()"
        :value="responseChoice.id"
        class="custom-hidden"
        @click="unCheck(responseChoice.id)"
      />
      <label :for="genInputId(responseChoiceIndex)">
        <ResponseChoice
          :for="genInputId(responseChoiceIndex)"
          :response-choice="responseChoice"
          :response-choice-index="responseChoiceIndex"
          :selected="isResponseChoiceSelected(responseChoice.id)"
          :color="props.color"
        />
      </label>
    </div>
  </fieldset>
</template>

<script setup lang="ts">
import { PropType } from "vue"
import { ResponseChoice as ResponseChoiceType } from "~/composables/types"

const props = defineProps({
  responseChoices: {
    type: Array as PropType<ResponseChoiceType[]>,
    required: true,
  },
  modelValue: { type: Number, required: false, default: null },
  color: { type: String, required: true },
  questionId: { type: [Number, String], required: true },
})

const previousAnswer = ref()
const answer = useModel("modelValue")

const isResponseChoiceSelected = computed(
  () => (responseChoiceId) => responseChoiceId === props.modelValue
)

function genInputId(responseChoiceIndex = null) {
  if (responseChoiceIndex === null) {
    return `question-${props.questionId}-unique-choice`
  }
  return `question-${props.questionId}-unique-choice-${responseChoiceIndex}`
}

function unCheck(responseChoiceId) {
  if (responseChoiceId === previousAnswer.value) {
    answer.value = null
  }
  previousAnswer.value = props.modelValue
}
</script>
