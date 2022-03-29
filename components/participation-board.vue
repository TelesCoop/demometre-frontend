<template>
  <div class="has-background-shade-100 p-1_5">
    <div class="columns">
      <div class="column is-one-third">
        <h3 class="has-text-weight-bold mb-2">Évaluation</h3>

        <div class="mb-0_5 has-text-shade-400">Participation</div>
        <div class="mb-2">{{ assessment.participationNb }}</div>

        <!-- TODO Récupérer le porteur -->
        <template v-if="assessment.initiatedBy">
          <div class="mb-0_5">Portée par</div>
          <div class="mb-2">{{ assessment.initiatedBy }}</div>
        </template>

        <div class="mb-0_5">Lancée le</div>
        <div class="mb-2">{{ displayDate(assessment.initializationDate) }}</div>
      </div>

      <div class="column">
        <h3 class="has-text-weight-bold mb-2">Représentativité</h3>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { displayDate } from "assets/utils/date"

const props = defineProps({
  assessment: { type: Object, required: true },
})
</script>
