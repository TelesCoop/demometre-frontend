<template>
  <div class="container">
    <div class="section">
      <h1 class="title is-1 has-text-black">
        Questionnaire "{{ role }}"
      </h1>
    </div>

    <div>
      <div class="title is-3">
        Question d'affinage
      </div>
      <ExportProfilingQuestions :role-id="roleId" />
    </div>

    <div>
      <div class="title is-3">
        Questionnaire
      </div>
      <ExportSurveyQuestions :role-id="roleId" />
    </div>
    <div
      class="print-button"
      @click="print"
    >
      imprimer
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useProfilingStore } from "~/stores/profilingStore"

definePageMeta({
  breadcrumb: "Impression",
  layout: "empty",
  title: "Questionnaire papier - Impression",
})

const profilingStore = useProfilingStore()
const route = useRoute()

const roleId = computed(() => {
  return Number(route.params.roleId)
})
const role = computed(() => {
  LOCALITY_TYPE
  return profilingStore.roleById[route.params.roleId as string]?.name
})

const print = () => {
  window.print()
}
</script>
<style lang="sass" scoped>
.print-button
  position: fixed
  bottom: 0
  right: 0
  padding: 1rem
  background-color: $primary
  color: white
  cursor: pointer
  border-radius: 0.5rem
  margin: 1rem
  box-shadow: 0 0 1rem rgba(black, 0.1)
  z-index: 1000
  &:hover
    background-color: $primary-dark

@media print
  .print-button
    display: none
</style>
