<template>
  <div :class="`has-text-${props.color}-dark`">
    <p :class="`is-uppercase is-size-6bis mb-0_5`">
      Question
    </p>
    <p :class="`is-size-4 has-text-weight-bold mb-2`">
      {{ props.question.questionStatement }}
    </p>
    <slot />
    <p class="is-uppercase is-size-6bis mb-0_5 mt-2">
      Acteur(s) concerné(s)
    </p>
    <div class="tags">
      <span
        v-for="roleId of props.question.roleIds"
        :key="roleId"
        :class="`tag is-${props.color}`"
      >{{ profilingStore.roleById[roleId]?.name }}</span>
    </div>
    <p :class="`is-uppercase is-size-6bis mb-0_5`">
      Villes concernées
    </p>
    <div class="tags">
      <span
        v-if="props.question.populationLowerBound"
        :class="`tag is-${props.color}`"
      >Plus de {{ props.question.populationLowerBound }} habitants</span>
      <span
        v-if="props.question.populationUpperBound"
        :class="`tag is-${props.color}`"
      >Moins de {{ props.question.populationUpperBound }} habitants</span>
      <span
        v-if="
          !props.question.populationLowerBound &&
            !props.question.populationUpperBound
        "
        :class="`tag is-${props.color}`"
      >Toutes tailles</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProfilingStore } from "~~/stores/profilingStore"

const props = defineProps({
  question: { type: Object, required: true },
  color: { type: String, required: true },
})

const profilingStore = useProfilingStore()
</script>

<style scoped lang="sass">
.tag
  background-color: var(--color-light)!important
</style>
