<template>
  <div class="container">
    <div class="section">
      <PageTitle title="Espace animateur" />
      <PageSection
        :title="pageStore.animatorPage.responsesTitle"
        :intro="pageStore.animatorPage.responsesIntro"
        :buttons="[{text: 'Revenir aux participant·e·s', link: `/compte/ateliers/${workshopId}/participants`, iconLeft: true, icon: 'arrow-left-line'}]"
      >
        <p
          class="is-family-secondary mb-4"
          style="margin-top: -3rem"
        >
          Atelier: {{ animatorStore.workshopById[workshopId].name }}
        </p>
        <div class="container">
          <section
            ref="pillarsRef"
            class="columns is-multiline mt-4"
          >
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
import { Ref, ref } from "vue"
import { useQuestionnaireStore } from "~/stores/questionnaireStore"
import { Marker, PillarType } from "~/composables/types"
import { useAnimatorStore } from "~/stores/animatorStore"
import { useProfilingStore } from "~/stores/profilingStore"
import { usePageStore } from "~/stores/pageStore"
import { useUserStore } from "~/stores/userStore"

definePageMeta({
  title: "Réponses",
  breadcrumb: "Réponses"
})

const questionnaireStore = useQuestionnaireStore()
const profilingStore = useProfilingStore()
const pageStore = usePageStore()
const userStore = useUserStore()
const router = useRouter()
const route = useRoute()
const workshopId: Ref<number> = ref(+route.params.workshopId)
const animatorStore = useAnimatorStore()

if (!pageStore.animatorPage.listWorkshopsTitle) {
  pageStore.getAnimatorPage()
}
if (!animatorStore.workshopById[workshopId.value]) {
  animatorStore.getWorkshop(workshopId.value)
}
if (!profilingStore.roles.length) {
  profilingStore.getRoles()
}

if (!userStore.isLoggedIn) {
  navigateTo(`/login`)
}
if (!userStore.isExpertUser) {
  navigateTo(`/`)
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
