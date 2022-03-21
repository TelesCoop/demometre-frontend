<template>
  <div
    class="answer"
    :class="
      props.selected
        ? 'has-border-success has-background-success-light'
        : 'has-border-transparent'
    "
  >
    <div
      class="letter mr-1"
      :class="
        props.selected
          ? 'has-border-success has-background-success has-text-white'
          : 'has-border-black'
      "
    >
      {{ letter }}
    </div>
    <div class="answer-content">
      <p class="answer-title has-text-black">{{ props.title }}</p>
      <p class="answer-description is-size-6bis">{{ props.description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  title: { type: String, required: true },
  description: { type: String, required: true },
  answerIndex: { default: 0 },
  selected: { default: false },
})
const letters = "ABCDEFGHIJKLMOPQRSTUVWXYZ"

const letter = computed(() => letters[props.answerIndex])
</script>

<style>
.answer {
  display: flex;
  padding: 16px;
  background: #fafafa;
  border-radius: 6px;
  cursor: pointer;
}
.answer .letter {
  text-align: center;
  padding-top: 6px;
  min-width: 40px;
  height: 40px;
  border-radius: 6px;
}
</style>
