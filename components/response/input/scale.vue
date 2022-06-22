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
            <slot name="left-symbol">{{ responseChoiceIndex + 1 }}</slot>
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
        :model-value="getAnswerSliderValue(category.id)"
        :category="category"
        :color="props.color"
        :bounds="bounds"
        :selected="hasAnsweredCategory(category.id)"
        @update:model-value="(val) => updateOne(val, category.id)"
      />
    </div>
  </fieldset>
</template>

<script setup lang="ts">
import { PropType } from "vue"
import {
  Category,
  ClosedWithScaleResponse,
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
    type: Array as PropType<ClosedWithScaleResponse[]>,
    required: false,
    default: (props) => {
      return props.categories.map((category) => {
        return { categoryId: category.id, responseChoiceId: null }
      })
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

const answer = useModel<ClosedWithScaleResponse[]>("modelValue", {
  type: "array",
})

function updateOne(value, categoryId) {
  const newAnswer = answer.value.map((categoryResponse) => {
    if (categoryResponse.categoryId === categoryId) {
      return {
        ...categoryResponse,
        responseChoiceId: props.responseChoices[value - 1].id,
      }
    } else {
      return categoryResponse
    }
  })
  answer.value = newAnswer
}

function getResponseChoiceIdByCategoryId(categoryId) {
  return answer.value.filter(
    (categoryResponse) => categoryResponse.categoryId === categoryId
  )[0].responseChoiceId
}

function getAnswerSliderValue(categoryId) {
  return (
    props.responseChoices
      .map((responseChoice) => responseChoice.id)
      .indexOf(getResponseChoiceIdByCategoryId(categoryId)) + 1 || 1
  )
}

function hasAnsweredCategory(categoryId) {
  return getResponseChoiceIdByCategoryId(categoryId) !== null
}
</script>

<style lang="sass" scoped>
.number
  min-width: 18px
  height: 18px
  border-radius: 3px
</style>
