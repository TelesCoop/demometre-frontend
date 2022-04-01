<template>
  <div class="has-background-shade-100 p-1_5">
    <div class="columns">
      <div class="column is-one-third">
        <h3 class="has-text-weight-bold mb-2">Évaluation</h3>

        <div class="mb-0_5 has-text-shade-400">Participation</div>
        <div class="mb-2">{{ assessment.participationNb }}</div>

        <template v-if="assessment.initiatedBy">
          <div class="mb-0_5">Portée par</div>
          <div class="mb-2">
            {{ assessment.initiatedBy?.firstName }}
            {{ assessment.initiatedBy?.lastName }}
          </div>
        </template>

        <div class="mb-0_5">Lancée le</div>
        <div class="mb-2">{{ assessment.initializationDate }}</div>
      </div>

      <div class="column">
        <h3 class="has-text-weight-bold mb-0_5">Représentativité</h3>
        <p class="mb-2">Survoler les barres pour afficher les statistiques.</p>
        <div class="columns is-multiline">
          <div class="column is-half">
            <ParticipationBoardRepresentativity
              :item="{
                title: 'Situation professionnelle',
                score: 2,
                data: data,
              }"
            ></ParticipationBoardRepresentativity>
          </div>
          <div class="column is-half">
            <ParticipationBoardRepresentativity
              :item="{
                title: 'Parité',
                score: 3,
                data: data,
              }"
            ></ParticipationBoardRepresentativity>
          </div>
          <div class="column is-half">
            <ParticipationBoardRepresentativity
              :item="{
                title: 'Tranche d’âge',
                score: 2,
                data: data,
              }"
            ></ParticipationBoardRepresentativity>
          </div>
          <div class="column is-half">
            <ParticipationBoardRepresentativity
              :item="{
                title: 'Répartition territoriale',
                score: 1,
                data: data,
              }"
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
const data = [
  {
    value: 0.2,
    metadata: {
      title: "Indépendant",
    },
  },
  {
    value: 0.3,
    metadata: {
      title: "Chomage",
    },
  },
  {
    value: 0.4,
    metadata: {
      title: "Travail",
    },
  },
  {
    value: 0.4,
    metadata: {
      title: "Etudiant",
    },
  },
]
</script>
