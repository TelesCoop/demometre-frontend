<template>
  <div class="container">
    <h1 class="is-size-1">
      Tableau de bord de
      {{
        assessmentStore.currentAssessment.municipality
          ? "ma commune"
          : "mon inter-communalité"
      }}
    </h1>
    {{ assessmentStore.currentAssessment }}
    <h2 class="is-size-3 mb-2">
      {{ assessmentStore.currentAssessment.municipality.name }}
    </h2>
    <!-- TODO changer le background -->
    <div class="has-background-white-ter p-1_5">
      <div class="columns">
        <div class="column is-one-third">
          <h3 class="has-text-weight-bold">Évaluation</h3>

          <div>Participation</div>
          <div>{{ assessmentStore.currentAssessment.participationNb }}</div>

          <!-- TODO Récupérer le porteur -->
          <template v-if="assessmentStore.initiatedBy">
            <div>Portée par</div>
            <div>{{ assessmentStore.currentAssessment.initiatedBy }}</div>
          </template>

          <div>Lancée le</div>
          <div>{{ assessmentStore.currentAssessment.initializationDate }}</div>
        </div>

        <div class="column">
          <h3 class="has-text-weight-bold">Représentativité</h3>
        </div>
      </div>
    </div>
    <div class="buttons mt-4">
      <NuxtLink to="/evaluation/role" class="button is-normal is-rounded"
        ><span>Poursuivre l'évaluation</span>
        <span class="icon"> <icon size="16" name="arrow-right-line" /> </span
      ></NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAssessmentStore } from "~/stores/assessmentStore"
definePageMeta({
  title: "Localisation",
  breadcrumb: "Localisation",
  middleware: ["assessment"],
})

const assessmentStore = useAssessmentStore()
</script>

<style scoped lang="sass"></style>
