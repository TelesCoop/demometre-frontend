<template>
  <fieldset>
    <legend class="is-size-7 mb-0_75 is-block has-text-grey level">
      <div class="level-left">
        <div
          v-for="(responseChoice, responseChoiceIndex) of props.responseChoices"
          :key="responseChoiceIndex"
          class="level-item has-text-centered mr-1_5"
        >
          <div
            class="number mr-0_5"
            :class="`has-border-${props.color} has-background-white has-text-${props.color}-dark `"
          >
            <slot name="left-symbol">{{ responseChoiceIndex }}</slot>
          </div>
          <span>{{ responseChoice.responseChoice }}</span>
        </div>
      </div>
    </legend>
    <div
      v-for="(category, categoryIndex) of props.categories"
      :key="categoryIndex"
      class="mb-1"
    >
      <ResponseNumberChoice
        :model-value="answer[category.id] || 1"
        :category="category"
        :color="props.color"
        :bounds="bounds"
        :selected="answer[category.id] !== null"
        @update:model-value="(val) => updateOne(val, category.id)"
      />
    </div>
  </fieldset>
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
  categories: {
    type: Array as PropType<Category[]>,
    required: true,
  },
  modelValue: {
    type: Object as PropType<{ [key: number]: number }>,
    required: false,
    default: (props) => {
      return props.categories.reduce((acc, category) => {
        acc[category.id] = null
        return acc
      }, {})
    },
  },
  color: { type: String, required: true },
  responseChoices: {
    type: Array as PropType<ResponseChoiceType[]>,
    required: true,
  },
})

const bounds = computed<QuestionBounds>(() => {
  const length = props.responseChoices.length
  return {
    min: { label: props.responseChoices[0].responseChoice, value: 1 },
    max: {
      label: props.responseChoices[length - 1].responseChoice,
      value: length,
    },
  }
})

const answer = useModel<object>("modelValue", { type: "object" })

function updateOne(value, id) {
  answer.value = { ...answer.value, [id]: value }
}
</script>

<style lang="sass" scoped>
.number
  min-width: 18px
  height: 18px
  border-radius: 3px
</style>
