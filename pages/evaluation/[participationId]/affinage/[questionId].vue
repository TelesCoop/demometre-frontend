<template>
  <div class="container is-tight pillar-try">
    <Question
      :question-id="questionId"
      :color="color"
      question-type="profiling"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: "Affinage",
  breadcrumb: "affinage",
  middleware: ["participation"],
})

const route = useRoute()
const questionId: number = +route.params.questionId
const color = ref("no-pillar")
</script>

<style scoped lang="sass"></style>
