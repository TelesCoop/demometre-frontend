<template>
  <div class="columns">
    <aside class="menu column is-5 mr-2">
      <div class="tabs">
        <ul
          :class="`has-text-${color}`"
          :style="`border-bottom-color: currentColor`"
        >
          <li class="is-active">
            <a
              :class="`has-text-${color}-dark`"
              :style="`border-bottom-color: currentColor`"
              >Questions</a
            >
          </li>
        </ul>
      </div>
      <ul class="menu-list">
        <li v-for="question of questions" :key="question.id">
          <a
            :class="[
              `has-text-${props.color}-dark `,
              question === activeQuestion && `has-background-${props.color}`,
              question.id === hoverQuestionId &&
                `has-background-${props.color}-light`,
            ]"
            @click="onSelectQuestion(question)"
            @mouseenter="hoverQuestionId = question.id"
            @mouseleave="hoverQuestionId = null"
            ><span :class="`has-text-${props.color}-active`">{{
              question.concatenatedCode.substring(1).replace(/^\./, "")
            }}</span>
            {{ question.questionStatement }}</a
          >
        </li>
      </ul>
    </aside>
    <div class="content column is-7 mb-1_5">
      <h2 class="title is-4 mb-0_75" :class="`has-text-${props.color}-dark`">
        {{ wordTitleCase(props.pillar.name) }}
      </h2>
      <hr class="my-0_75" :class="`has-background-${props.color}`" />
      <div v-if="activeQuestion" :class="`has-text-${props.color}-dark`">
        <p :class="`is-uppercase is-size-6 mb-0_5`">Question</p>
        <p :class="`is-size-4 has-text-weight-bold mb-2`">
          {{ activeQuestion.questionStatement }}
        </p>
        <table style="width: 100%">
          <tr>
            <td :class="`is-uppercase is-size-6`">Participant·e·s</td>
            <td :class="`is-uppercase is-size-6`">Réponses</td>
          </tr>
          <tr>
            <td></td>
          </tr>
        </table>
        <p :class="`is-uppercase is-size-6`">Participant·e·s</p>
      </div>
      <div v-else>
        <p>Selectionner une question</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useQuestionnaireStore } from "~/stores/questionnaireStore"
import { Question } from "~/composables/types"
import { wordTitleCase } from "~/utils/util"

const questionnaireStore = useQuestionnaireStore()

const props = defineProps({
  pillar: { type: Object, required: true },
  color: { type: String, required: true },
})

const questions = computed<Question[]>(() =>
  questionnaireStore.getQuestionnaireQuestionByPillarName(props.pillar.name)
)
const activeQuestion = ref<Question>()
const hoverQuestionId = ref<number>()

const onSelectQuestion = (question) => {
  activeQuestion.value = question
}

watch(
  () => props.pillar,
  () => {
    activeQuestion.value = null
  }
)
</script>
