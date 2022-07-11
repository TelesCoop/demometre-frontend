<template>
  <div class="container">
    <div class="section">
      <PageTitle title="Espace animateur" />
      <PageSection
        title="Réponses"
        :intro="`Saisissez les réponses à l’évaluation pour chacun·e des participant·e·s. de votre atelier ${animatorStore.workshopById[workshopId].name}.`"
        button-text="Revenir aux participant·e·s"
        :button-link="`/profil/ateliers/${workshopId}/participants`"
        :left-icon="true"
        icon="arrow-left-line"
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
              :workshop-id="workshopId"
            />
          </section>
        </div>
      </PageSection>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Ref, ref } from "@vue/reactivity"
import { useQuestionnaireStore } from "~/stores/questionnaireStore"
import { Marker, PillarType } from "~/composables/types"
import { useAnimatorStore } from "~~/stores/animatorStore"
import { useProfilingStore } from "~~/stores/profilingStore"

definePageMeta({
  title: "Réponses",
  breadcrumb: "Réponses",
  middleware: ["animator-space"],
})

const questionnaireStore = useQuestionnaireStore()
const profilingStore = useProfilingStore()
const router = useRouter()
const route = useRoute()
const workshopId: Ref<number> = ref(+route.params.workshopId)
const animatorStore = useAnimatorStore()
if (!animatorStore.workshopById[workshopId.value]) {
  animatorStore.getWorkshop(workshopId.value)
}
if (!profilingStore.roles.length) {
  profilingStore.getRoles()
}

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
