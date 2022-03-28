<template>
  <div class="container is-tight">
    <h1 class="title is-3 mt-2">Etes-vous actuellement...</h1>
    <div class="my-1_5">
      <ResponseInputUniqueChoice
        v-model="answer"
        :response-choices="responseChoices"
        :color="color"
        question-id="role"
        white-letter-when-select="true"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "@vue/reactivity"
import { useProfilingStore } from "~/stores/profilingStore"

const color = ref("no-pillar")
const answer = ref()

const profilingStore = useProfilingStore()
if (!profilingStore.roles.length) {
  profilingStore.loadRoles()
}

const responseChoices = computed(() => {
  let responseChoices = []
  for (const role of profilingStore.roles) {
    responseChoices.push({
      id: role.id,
      responseChoice: role.name,
      description: role.description,
    })
  }
  return responseChoices
})
</script>

<style scoped lang="sass">
input:checked + label
  background-color: $black
  color: $white
.buttons .locality-container:not(:last-child):not(.is-fullwidth)
  margin-right: 0.5rem
</style>
