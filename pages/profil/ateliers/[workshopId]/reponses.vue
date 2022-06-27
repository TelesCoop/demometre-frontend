<template>
  <div class="container">
    <div class="section">
      <PageTitle title="Espace animateur" subtitle="" />
      <PageSection
        title="Réponses"
        intro="Saisissez les réponses à l’évaluation pour chacun·e des participant·e·s."
        button-text="Revenir aux participant·e·s"
        button-link="/profil/ateliers/participants"
      >
        <div class="container">
          <section ref="pillarsRef" class="columns is-multiline mt-4">
            <div
              v-for="pillar of questionnaireStore.pillars"
              :key="pillar.name"
              class="column"
            >
              <QuestionnairePillar
                :name="pillar.name"
                :active="pillar.name === activePillar?.name"
                style="cursor: pointer"
                @click="onSelectPillar(pillar)"
              />
            </div>
          </section>
          <section v-if="activePillar">
            <QuestionnairePillarAnimatorResponses
              :pillar="activePillar"
              :color="colorClass"
            />
          </section>
        </div>
      </PageSection>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuestionnaireStore } from "~/stores/questionnaireStore"
import { Marker, PillarType } from "~/composables/types"

definePageMeta({
  title: "Réponses",
  breadcrumb: "Réponses",
})

const questionnaireStore = useQuestionnaireStore()
const router = useRouter()

const activePillar = ref<PillarType>()
const markers = ref<Marker[]>()

const colorClass = computed(() =>
  activePillar.value ? PillarParams[activePillar.value.name].color : ""
)
const onSelectPillar = (pillar) => {
  activePillar.value = pillar
  markers.value = activePillar.value?.markerIds.map(
    (markerId) => questionnaireStore.markerById[markerId]
  )
  router.push({ query: { pillar: pillar.name } })
}
</script>

<style scoped lang="sass"></style>
