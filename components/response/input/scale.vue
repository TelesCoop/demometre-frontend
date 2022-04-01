<template>
  <fieldset>
    <legend class="is-size-6bis mb-0_75 is-block has-text-grey">
      <!--  TODO set scale  -->
    </legend>
    <div
      v-for="(category, categoryIndex) of props.categories"
      :key="categoryIndex"
      class="mb-1"
    >
      <ResponseNumberChoice
        :model-value="answer[category.id]"
        :category="category"
        :color="color"
        :bounds="bounds"
        @update:model-value="(val) => updateOne(val, category.id)"
      />
    </div>
  </fieldset>
</template>

<script setup lang="ts">
import { PropType } from "vue"
import { Category, QuestionBounds } from "~/composables/types"
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
  bounds: { type: Object as PropType<QuestionBounds> },
})

const answer = useModel("modelValue", { type: "object" })

function updateOne(value, id) {
  answer.value = { ...answer.value, [id]: value }
}
</script>
