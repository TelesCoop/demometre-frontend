<template>
  <fieldset>
    <legend class="is-size-6bis mb-0_75 is-block has-text-grey">
      Choisissez une réponse
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
        class="custom"
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
import { computed, PropType } from "vue"
import { ResponseChoice as ResponseChoiceType } from "~/composables/types"

const props = defineProps({
  responseChoices: {
    type: Array as PropType<ResponseChoiceType[]>,
    required: true,
  },
  modelValue: { type: Number, required: false, default: 0 },
  color: { type: String, required: true },
  questionId: { type: Number, required: true },
})

const answer = useModel(props, "modelValue")

const isResponseChoiceSelected = computed(
  () => (responseChoiceId) => responseChoiceId === props.modelValue
)

function genInputId(responseChoiceIndex = null) {
  if (responseChoiceIndex === null) {
    return `question-${props.questionId}-unique-choice`
  }
  return `question-${props.questionId}-unique-choice-${responseChoiceIndex}`
}
</script>
