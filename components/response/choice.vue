<template>
  <div
    class="response-choice"
    :class="
      props.selected
        ? `has-border-${props.color}-dark has-background-${props.color}-light-active`
        : `has-border-transparent has-background-${props.color}-light`
    "
  >
    <div
      class="letter mr-4"
      :class="
        `has-text-${props.color}-dark ` + props.selected
          ? `has-border-${props.color}-dark has-background-${props.color}`
          : `has-border-${props.color}`
      "
    >
      {{ letter }}
    </div>
    <div class="response-choice-content">
      <p class="response-choice-title has-text-black">
        {{ props.responseChoice.responseChoice }}
      </p>
      <p class="response-choice-description is-size-6bis">description</p>
      <!-- TODO actual description-->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ResponseChoice } from "~/composables/types"
import { PropType } from "vue"

const props = defineProps({
  responseChoice: { required: true, type: Object as PropType<ResponseChoice> },
  responseChoiceIndex: { type: Number, default: 0 },
  selected: { type: Boolean, default: false },
  color: { type: String, required: true },
})
const letters = "ABCDEFGHIJKLMOPQRSTUVWXYZ"

const letter = computed(() => letters[props.responseChoiceIndex])
</script>

<style lang="sass">
.response-choice
  display: flex
  padding: 16px
  border-radius: 6px
  cursor: pointer
  + .response-choice
    margin-top: 10px
  .letter
    text-align: center
    padding-top: 6px
    min-width: 40px
    height: 40px
    border-radius: 6px
</style>
