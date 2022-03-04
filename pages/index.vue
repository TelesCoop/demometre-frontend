<template>
  <h1>COUCOU</h1>
  <div
    v-for="question of Object.values(questionnaireStore.questionById)"
    :key="question.id"
  >
    {{ question.code }}
    {{ question.name }}
  </div>
</template>

<script setup lang="ts">
import { useQuestionnaireStore } from "~/stores/questionnaireStore";

const questionnaireStore = useQuestionnaireStore();

if (!Object.keys(questionnaireStore.questionById).length) {
  console.log("### load questions");
  questionnaireStore.loadQuestions();
}
</script>
