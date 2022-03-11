<template>
  <div style="margin: auto; max-width: 1200px; padding-top: 100px">
    <div style="display: flex">
      <Pillar
        v-for="name of names"
        :key="name"
        :name="name"
        :active="name === activePillar"
        style="cursor: pointer"
        @click="activePillar = name"
      />
    </div>
    <h2 class="title is-2">{{ title }}</h2>
    <Answers v-model="selectedAnswer" :answers="answers" />
    <div class="mb-6"></div>
    <p>Selected answer id : {{ selectedAnswer }}</p>
    <div class="mb-6"></div>
  </div>
</template>

<script setup lang="ts">
import { Answer as AnswerType } from "~/composables/types"
import { wordTitleCase } from "~/utils"
import { useQuestionnaireStore } from "~/stores/questionnaireStore"

const questionnaireStore = useQuestionnaireStore()

if (!Object.keys(questionnaireStore.questionById).length) {
  questionnaireStore.loadQuestionnaire()
}

const activePillar = ref("représentation")
const names = ["représentation", "transparence", "participation", "coopération"]
const title = computed(() => wordTitleCase(activePillar.value))
const isAnswerSelected = ref(false)
const selectedAnswer = ref(0)
const answers: AnswerType[] = [
  {
    title: "Réponse A",
    description: "Une description super longue pour comprendre plus mieux",
    id: 0,
  },
  {
    title: "Réponse B",
    description: "Une description super longue pour comprendre plus mieux",
    id: 1,
  },
  {
    title: "Réponse C",
    description: "Une description super longue pour comprendre plus mieux",
    id: 2,
  },
  {
    title: "Réponse D",
    description: "Une description super longue pour comprendre plus mieux",
    id: 3,
  },
  {
    title: "Réponse E",
    description: "Une description super longue pour comprendre plus mieux",
    id: 4,
  },
]
</script>
