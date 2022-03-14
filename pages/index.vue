<template>
  <div class="homepage container">
    <home-intro />

    <div
      v-for="question of Object.values(questionnaireStore.questionById)"
      :key="question.id"
    >
      {{ question.code }}
      {{ question.name }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuestionnaireStore } from "~/stores/questionnaireStore"
import HomeIntro from "~/components/homepage/home-intro.vue"

const questionnaireStore = useQuestionnaireStore()

if (!Object.keys(questionnaireStore.questionById).length) {
  questionnaireStore.loadQuestions()
}
</script>
