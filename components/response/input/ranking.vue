<template>
  <fieldset>
    <legend class="is-size-6bis mb-0_75 is-block has-text-grey">
      <slot name="legend">
        Indiquer l'ordre d'importance de chaque proposition.
      </slot>
    </legend>
    <span aria-live="assertive" class="assistive-text">
      {{ assistiveText }}
    </span>
    <span id="operation" class="assistive-text">
      Appuyer sur espace pour réordonner
    </span>
    <draggable
      v-model="miniChoices"
      group="choices"
      item-key="id"
      class="mb-1"
      :animation="100"
      tag="ol"
      role="listbox"
      aria-describedby="operation"
      :move="(event) => (draggingByMouse = event.draggedContext.element.id)"
      @change="computeRankings($event.moved.element)"
      @end="draggingByMouse = undefined"
      @keydown.up.prevent="moveItem(Direction.UP)"
      @keydown.down.prevent="moveItem(Direction.DOWN)"
      @keydown.space.prevent="toggleGrabbed()"
    >
      <template #item="{ element, index: displayIndex }">
        <li
          class="mb-1 choice-element"
          role="option"
          draggable="true"
          :tabindex="focusedKeyboardDisplayIndex === displayIndex ? '0' : '-1'"
          aria-describedby="operation"
          :aria-selected="focusedKeyboardDisplayIndex === displayIndex"
          @blur="isGrabbed = false"
        >
          <ResponseChoice
            :response-choice="responseChoices[element.index]"
            :response-choice-index="element.index"
            :selected="isResponseChoiceSelected(element.id)"
            :dragging="
              draggingByMouse === element.id ||
              (focusedKeyboardDisplayIndex === displayIndex && isGrabbed)
            "
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

const draggingByMouse = ref<number>()
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

// ACCESSIBILITY LOGIC

const focusedKeyboardDisplayIndex = ref<number>(0)
const isGrabbed = ref<boolean>(false)
const assistiveText = ref<string>("")

const focusedKeyboardMiniChoice = computed<MiniChoice>(
  () => miniChoices.value[focusedKeyboardDisplayIndex.value]
)
const draggingByKeyboardChoice = computed<ResponseChoiceType>(() => {
  if (!isGrabbed.value) return null
  return props.responseChoices[
    miniChoices.value[focusedKeyboardDisplayIndex.value].index
  ]
})

enum AccessibleHint {
  GRAB = "grab",
  DROP = "drop",
  SELECT = "select",
}

enum Direction {
  UP = "up",
  DOWN = "down",
}

function setAccessibilityText(
  msg: AccessibleHint,
  elementTitle: string,
  index: number
) {
  switch (msg) {
    case AccessibleHint.GRAB:
      assistiveText.value = `${elementTitle}, grabbed. Current position in list: ${index}. Press up and down arrows to change position, spacebar to drop.`
      break
    case AccessibleHint.DROP:
      assistiveText.value = `${elementTitle}, dropped. Final position in list: ${index}.`
      break
    case AccessibleHint.SELECT:
      assistiveText.value = `${elementTitle}. New position in list: ${index}`
  }
}

function toggleGrabbed() {
  computeRankings(focusedKeyboardMiniChoice.value)
  if (isGrabbed.value) {
    setAccessibilityText(
      AccessibleHint.DROP,
      draggingByKeyboardChoice.value.responseChoice,
      focusedKeyboardDisplayIndex.value
    )
    isGrabbed.value = false
  } else {
    isGrabbed.value = true
    setAccessibilityText(
      AccessibleHint.GRAB,
      draggingByKeyboardChoice.value.responseChoice,
      focusedKeyboardDisplayIndex.value
    )
  }
}

function moveItem(direction: Direction) {
  const hoverIndex =
    direction === Direction.DOWN
      ? focusedKeyboardDisplayIndex.value + 1
      : focusedKeyboardDisplayIndex.value - 1
  if (hoverIndex < 0 || hoverIndex >= miniChoices.value.length) {
    return
  }

  if (!isGrabbed.value) {
    focusedKeyboardDisplayIndex.value = hoverIndex
  } else {
    // Make a copy of the existing list & find the item that's being moved
    const arrayCopy = [...miniChoices.value]
    const draggedItem = arrayCopy[focusedKeyboardDisplayIndex.value]

    // Move the item that's being moved
    arrayCopy.splice(focusedKeyboardDisplayIndex.value, 1)
    arrayCopy.splice(hoverIndex, 0, draggedItem)

    // Update the list of todos to reflect the new order
    miniChoices.value = arrayCopy

    focusedKeyboardDisplayIndex.value = hoverIndex
  }
  // Wait for the DOM to update, then find all list items & focus the one that was just moved
  nextTick(() => {
    const items = [...document.getElementsByClassName("choice-element")]
    items[hoverIndex].focus()
  })
  if (isGrabbed.value)
    setAccessibilityText(
      AccessibleHint.SELECT,
      draggingByKeyboardChoice.value.responseChoice,
      hoverIndex
    )
}
</script>

<style scoped lang="sass">
ol
  list-style: none
</style>
