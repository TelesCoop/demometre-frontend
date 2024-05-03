<template>
  <div class="no-page-break-inside paper-question">
    <div
      class="title is-size-5"
      :class="`has-text-${props.color}-dark`"
    >
      <template v-if="question.concatenatedCode">
        {{ question.concatenatedCode }} -
      </template>{{ question.questionStatement }}
    </div>
    <RichText
      v-if="question.description"
      class="is-family-secondary"
      :rich-text="question.description"
      :color="props.color"
    />
    <section :class="`is-${color}`">
      <div>
        <!-- all possible inputs -->
        <FormPaperQuestionInput
          :color="color"
          :question="question"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type {
  Definition,
  QuestionResponse,
  SimpleBlock,
  Question,
} from "~/composables/types"
import { computed, PropType } from "vue"

const props = defineProps({
  question: { type: Object as PropType<Question>, required: true },
  color: { type: String, required: true },
})
</script>

<style scoped lang="sass">
.paper-question
  max-width: 50%
  transform: scale(0.8)
</style>
