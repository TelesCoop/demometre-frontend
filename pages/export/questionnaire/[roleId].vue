<template>
  <div class="container">
    <div class="mb-2">
      <h1 class="title is-3 has-text-black">
        Questionnaire "{{ role }}"
      </h1>
    </div>

    <div>
      <div class="title is-4">
        Question d'affinage
      </div>
      <ExportProfilingQuestions :role-id="roleId" />
    </div>

    <div>
      <div class="title is-4 page-break">
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
  background-color: $shade-600
  color: white
  cursor: pointer
  border-radius: 0.5rem
  margin: 1rem
  box-shadow: 0 0 1rem rgba(black, 0.1)
  z-index: 1000
  &:hover
    background-color: $shade-500

@media print
  .print-button
    display: none
</style>
