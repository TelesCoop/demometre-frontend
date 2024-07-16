<template>
  <ResponseInputUniqueChoice
    v-model="answer"
    :response-choices="responseChoices"
    :color="props.color"
    :question-id="questionId"
  >
    <template #legend>
      {{ $gettext("Choisissez oui ou non.") }}
    </template>
  </ResponseInputUniqueChoice>
</template>

<script setup lang="ts">
import { ResponseChoice as ResponseChoiceType } from "~/composables/types"
import { useGettext } from "vue3-gettext"

const props = defineProps({
  color: { type: String, required: true },
  questionId: { type: Number, required: true },
})

const { $gettext } = useGettext()

const answer = defineModel("modelValue", {
  type: Number,
  default: null,
  required: false,
})

const responseChoices = ref<ResponseChoiceType[]>([
  {
    id: 1,
    responseChoice: $gettext("Oui"),
    description: "",
  },
  {
    id: 0,
    responseChoice: $gettext("Non"),
    description: "",
  },
])
</script>

<style scoped lang="sass"></style>
