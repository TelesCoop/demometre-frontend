<template>
  <div class="open">
    <label
      class="is-size-6bis mb-0_75 is-block has-text-grey"
      :for="`$question-${props.questionId}-open`"
    >
      Réponse ouverte
    </label>
    <textarea
      :id="`$question-${props.questionId}-open`"
      v-model="answer"
      class="textarea has-text-grey-dark"
      :class="`has-background-${props.color}-light has-border-${props.color}-dark`"
      rows="12"
      placeholder="..."
    />
  </div>
</template>

<script setup lang="ts">
import { useModel } from "~/composables/modelWrapper"

const props = defineProps({
  color: { type: String, required: true },
  modelValue: { required: true },
  questionId: { required: true, type: Number },
})

const answer = useModel(props, "modelValue")
</script>

<style scoped lang="sass">
.open
  margin-right: 85px
  margin-left: 85px
</style>
