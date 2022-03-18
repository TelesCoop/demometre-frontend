<template>
  <div>
    <QuestionChoice
      v-for="(responseChoice, responseChoiceIndex) of props.responseChoices"
      :key="responseChoiceIndex"
      :response-choice="responseChoice"
      :response-choice-index="responseChoiceIndex"
      :selected="isResponseChoiceSelected(responseChoice.id)"
      :color="props.color"
      @click="selectResponseChoice(responseChoice.id)"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, PropType, onMounted, onDeactivated } from "vue"
import { ResponseChoice } from "~/composables/types"

const props = defineProps({
  responseChoices: {
    type: Array as PropType<ResponseChoice[]>,
    required: true,
  },
  modelValue: { type: Number, required: false, default: 0 },
  color: { type: String, required: true },
})
const isResponseChoiceSelected = computed(
  () => (responseChoiceId) => responseChoiceId === props.modelValue
)

const emit = defineEmits(["update:modelValue", "validate"])
const selectResponseChoice = (responseChoiceId) => {
  emit("update:modelValue", responseChoiceId)
}

// handle keyboard
const nextResponseChoice = (ev) => {
  const currentResponseChoiceIndex = props.responseChoices.findIndex(
    (responseChoice) => responseChoice.id === props.modelValue
  )
  if (currentResponseChoiceIndex === props.responseChoices.length - 1) {
    return
  }
  ev.preventDefault()
  selectResponseChoice(props.responseChoices[currentResponseChoiceIndex + 1].id)
}
const previousResponseChoice = (ev) => {
  const currentResponseChoiceIndex = props.responseChoices.findIndex(
    (responseChoice) => responseChoice.id === props.modelValue
  )
  if (currentResponseChoiceIndex === 0) {
    return
  }
  ev.preventDefault()
  selectResponseChoice(props.responseChoices[currentResponseChoiceIndex - 1].id)
}
const onKeyDown = (ev) => {
  console.log("### ev", ev)
  if (ev.key === "ArrowUp") {
    previousResponseChoice(ev)
    return
  }
  if (ev.key === "ArrowDown") {
    nextResponseChoice(ev)
    return
  }
  if (ev.key === "Enter") {
    ev.preventDefault()
    emit("validate")
  }
}
onMounted(() => {
  window.addEventListener("keydown", onKeyDown)
})
onDeactivated(() => {
  window.removeEventListener("keydown", onKeyDown)
})
</script>
