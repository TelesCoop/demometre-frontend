<template>
  <ResponseInputUniqueChoice
    v-model="answer"
    :response-choices="responseChoices"
    :color="props.color"
    :question-id="questionId"
  >
    <template #legend>Choisissez oui ou non.</template>
  </ResponseInputUniqueChoice>
</template>

<script setup lang="ts">
import { ResponseChoice as ResponseChoiceType } from "~/composables/types"

const props = defineProps({
  modelValue: { type: Number, required: false, default: null },
  color: { type: String, required: true },
  questionId: { type: Number, required: true },
})

const responseChoices = ref<ResponseChoiceType[]>([
  {
    id: 1,
    responseChoice: "Oui",
    description: "",
  },
  {
    id: 0,
    responseChoice: "Non",
    description: "",
  },
])

const answer = useModel("modelValue")
</script>

<style scoped lang="sass"></style>
