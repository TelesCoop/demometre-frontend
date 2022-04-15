<template>
  <div class="container is-tight pillar-try">
    <Question :question-id="questionId" :color="color" context="profiling" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: "Affinage",
  breadcrumb: "Affinage",
  // middleware: ["participation"],
})

const route = useRoute()
const questionId: number = +route.params.questionId
const color = ref("no-pillar")
</script>

<style scoped lang="sass"></style>
