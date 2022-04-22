<template>
  <div class="has-background-shade-100 p-1_5">
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
        <div class="mb-2">{{ assessment.initializationDate }}</div>
      </div>

      <div class="column">
        <h3 class="has-text-weight-bold mb-0_5">Représentativité</h3>
        <p class="mb-2">Survoler les barres pour afficher les statistiques.</p>
        <div class="columns is-multiline">
          <div
            v-for="representativity of assessment.representativities"
            :key="representativity.name"
            class="column is-half"
          >
            <ParticipationBoardRepresentativity
              :representativity-criteria="representativity"
            ></ParticipationBoardRepresentativity>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  assessment: { type: Object, required: true },
})
</script>
