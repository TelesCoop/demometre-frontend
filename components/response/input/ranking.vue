<template>
  <fieldset>
    <legend class="is-size-6bis mb-0_75 is-block has-text-grey">
      <slot name="legend">
        Indiquer l'ordre d'importance de chaque proposition.
      </slot>
    </legend>
    <draggable
      v-model="miniChoices"
      group="choices"
      item-key="id"
      class="mb-1"
      :animation="100"
      tag="ol"
      role="listbox"
      :move="(event) => (dragging = event.draggedContext.element.id)"
      @change="computeRankings($event.moved.element)"
      @end="dragging = undefined"
    >
      <template #item="{ element }">
        <li
          class="mb-1"
          role="option"
          draggable="true"
          aria-describedby="operation"
        >
          <ResponseChoice
            :response-choice="responseChoices[element.index]"
            :response-choice-index="element.index"
            :selected="isResponseChoiceSelected(element.id)"
            :dragging="dragging === element.id"
            :color="props.color"
            @click="computeRankings(element)"
          >
            <template #left-symbol>{{ element.rank || "..." }}</template>
          </ResponseChoice>
        </li>
      </template>
    </draggable>
  </fieldset>
</template>

<script setup lang="ts">
import { PropType } from "vue"
import { ResponseChoice as ResponseChoiceType } from "~/composables/types"
// pycharm tells me that the import is not used, but it IS
import draggable from "vuedraggable"

type MiniChoice = {
  id: number
  index: number
  rank?: number
}

const props = defineProps({
  responseChoices: {
    type: Array as PropType<ResponseChoiceType[]>,
    required: true,
  },
  modelValue: { type: Array, required: false, default: () => [] },
  color: { type: String, required: true },
  questionId: { type: Number, required: true },
})

const dragging = ref<number>()
const answer = useModel("modelValue")
answer.value = []
const miniChoices = ref<MiniChoice[]>(
  props.responseChoices.map((choice, index) => {
    return { id: choice.id, index }
  })
)
const selectedItems = ref<number[]>([])
const isResponseChoiceSelected = computed(
  () => (responseChoiceId) => selectedItems.value.includes(responseChoiceId)
)

function computeRankings(miniChoice: MiniChoice) {
  if (!selectedItems.value.includes(miniChoice.id)) {
    selectedItems.value.push(miniChoice.id)
  }
  answer.value = miniChoices.value.reduce(
    (accumulator: MiniChoice[], mChoice: MiniChoice) => {
      if (isResponseChoiceSelected.value(mChoice.id)) {
        mChoice.rank = accumulator.length + 1
        accumulator.push(mChoice)
      }
      return accumulator
    },
    []
  )
}
</script>

<style scoped lang="sass">
ol
  list-style: none
</style>
