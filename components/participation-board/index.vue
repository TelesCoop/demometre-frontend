<template>
  <div class="has-background-shade-100 board-container">
    <p class="title has-text-shade-900 is-4">
      Tableau de bord de la participation citoyenne
    </p>
    <div class="columns">
      <div class="column is-one-third">
        <h3 class="has-text-weight-bold mb-2">Évaluation</h3>

        <div class="mb-0_5 has-text-shade-400 is-uppercase is-size-7">
          Participation
        </div>
        <div class="mb-2">{{ assessment.participationNb }}</div>

        <template v-if="assessment.initiatedBy">
          <div class="mb-0_5 has-text-shade-400 is-uppercase is-size-7">
            Portée par
          </div>
          <div class="mb-2">
            {{ assessment.initiatedBy?.firstName }}
            {{ assessment.initiatedBy?.lastName }}
          </div>
        </template>

        <div class="mb-0_5 has-text-shade-400 is-uppercase is-size-7">
          Lancée le
        </div>
        <div class="mb-2">{{ initializationDate }}</div>
      </div>

      <div class="column">
        <h3 class="has-text-weight-bold mb-0_5">Représentativité</h3>
        <p class="mb-2 is-size-7">
          Survoler les barres pour afficher les statistiques.
        </p>
        <div class="columns is-multiline">
          <div
            v-for="representativity of assessment.representativities"
            :key="representativity.representativityCriteriaName"
            class="column is-half"
          >
            <ParticipationBoardRepresentativity
              :representativity="representativity"
            ></ParticipationBoardRepresentativity>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from "vue"
import { Assessment } from "~/composables/types"

const props = defineProps({
  assessment: { type: Object as PropType<Assessment>, required: true },
})

const initializationDate = computed(() =>
  new Date(props.assessment.initializationDate).toLocaleString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
)
</script>

<style scoped lang="sass">
img
  width: 100%
  object-fit: cover
.board-container
  padding: 1.5rem
@include tablet
  .board-container
    padding: 2.5rem
    padding-bottom: 1.5rem
</style>
