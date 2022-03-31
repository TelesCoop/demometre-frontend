<template>
  <div
    ref="choiceElement"
    class="response-choice"
    :class="
      `is-${color} ` +
      (props.selected || props.dragging
        ? `has-border-${props.color}-dark has-background-${props.color}-light-active`
        : `has-border-transparent has-background-${props.color}-light`) +
      (props.dragging ? ` dragging` : '')
    "
  >
    <div
      class="letter mr-4"
      :class="
        (props.color === 'no-pillar' && (props.selected || props.dragging)
          ? 'has-text-white '
          : `has-text-${props.color}-dark `) +
        (props.selected || props.dragging
          ? `has-border-${props.color}-dark has-background-${props.color}`
          : `has-border-${props.color} has-background-white`)
      "
    >
      <slot name="left-symbol">{{ letter }}</slot>
    </div>
    <div class="response-choice-content">
      <p class="response-choice-title has-text-black">
        {{ props.responseChoice.responseChoice }}
      </p>
      <p class="response-choice-description is-size-6bis">
        {{ props.responseChoice.description }}
      </p>
    </div>
    <div v-if="props.dragging" class="mb-auto mt-auto ml-auto">
      <icon name="drag-drop-line" size="24" class="icon mt-0_5 mr-0_5" />
    </div>
    <div v-else-if="props.selected" class="mb-auto mt-auto ml-auto check">
      <icon name="check" size="24" class="icon mt-0_5 mr-0_5" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ResponseChoice } from "~/composables/types"

const props = defineProps({
  responseChoice: { required: true, type: Object as PropType<ResponseChoice> },
  responseChoiceIndex: { type: Number, default: 0 },
  selected: { type: Boolean, default: false },
  dragging: { type: Boolean, default: false },
  color: { type: String, required: true },
})
const choiceElement = ref<HTMLElement>()
const letters = "ABCDEFGHIJKLMOPQRSTUVWXYZ"

onMounted(() => {
  window.addEventListener("keydown", (event) => compareKey(event.key))
})

const letter = computed(() => letters[props.responseChoiceIndex])

function compareKey(key: string) {
  if ((key as string).toUpperCase() === letter.value)
    choiceElement.value.click()
}
</script>

<style lang="sass" scoped>
@mixin choice-hover
  background-color: var(--color-light-hover) !important
  .letter
    border-color: var(--color-hover) !important
    background-color: var(--color-light) !important
  &.is-no-pillar .letter
    background-color: var(--color) !important
    border-color: var(--color) !important
    color: white !important

input:focus-visible,input:not(:checked):hover + label .response-choice
  @include choice-hover

.response-choice:hover, .response-choice.dragging, *:focus .response-choice
  @include choice-hover
  border: var(--color-dark) dashed 1px !important

.response-choice
  display: flex
  padding: 16px
  border-radius: 6px
  cursor: pointer
  line-height: 1.3
  .letter
    text-align: center
    padding-top: 8px
    min-width: 40px
    height: 40px
    border-radius: 6px
  .check
    color: var(--color-dark)
</style>
