<template>
  <ResponseInputUniqueChoice
    v-model="answer"
    :response-choices="responseChoices"
    :color="props.color"
    :question-id="questionId"
  >
    <template #legend> Choisissez oui ou non. </template>
  </ResponseInputUniqueChoice>
</template>

<script setup lang="ts">
import { ResponseChoice as ResponseChoiceType } from "~/composables/types"

const props = defineProps({
  modelValue: { type: Number, required: false, default: 0 },
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
    id: 2,
    responseChoice: "Non",
    description: "",
  },
])

const answer = useModel(props, "modelValue")
</script>

<style scoped lang="sass"></style>
