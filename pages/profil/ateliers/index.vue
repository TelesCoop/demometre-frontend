<template>
  <div class="container">
    <div class="section">
      <PageTitle title="Espace animateur" subtitle />
      <PageSection
        title="Ateliers"
        intro="Saisissez les ateliers que vous avez animé"
      >
        <div>
          <table class="table is-narrow is-fullwidth">
            <thead>
              <tr>
                <td class="has-text-shade-400 is-uppercase is-size-6">
                  Nom de l’atelier
                </td>
                <td class="has-text-shade-400 is-uppercase is-size-6">Date</td>
                <td class="has-text-shade-400 is-uppercase is-size-6">
                  Evaluation
                </td>
                <td></td>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="workshop of [
                  ...animatorStore.workshops,
                  ...newWorkshops,
                ]"
                :key="workshop.id"
              >
                <td>
                  <input
                    v-model="workshop.name"
                    :class="`input is-shade-300`"
                    type="text"
                    placeholder="écrire ici ..."
                  />
                </td>
                <td>
                  <input
                    v-model="workshop.date"
                    :class="`input is-shade-300`"
                    type="date"
                  />
                </td>
                <td>
                  <div class="select">
                    <select v-model="workshop.assessmentId">
                      <option
                        v-for="assessment of assessmentStore.assessments"
                        :key="assessment.id"
                        :value="assessment.id"
                      >
                        {{ assessmentTitle(assessment) }}
                      </option>
                    </select>
                  </div>
                </td>
                <td style="text-align: end">
                  <button
                    class="button is-rounded is-shade-600 is-outlined"
                    type="button"
                    :disabled="
                      !(workshop.name && workshop.date && workshop.assessmentId)
                    "
                    @click.prevent="saveAndAddParticipants(workshop)"
                  >
                    <span>Saisir les participant·e·s</span>
                    <span class="icon">
                      <icon size="16" name="user-add-line" />
                    </span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="buttons is-justify-content-space-between">
            <div>
              <button
                class="button is-rounded is-shade-600 is-outlined"
                type="button"
                @click.prevent="addWorkshop()"
              >
                <span class="icon">
                  <icon size="16" name="add-line" />
                </span>
                <span>Ajouter un atelier</span>
              </button>
              <button
                v-if="newWorkshops.length"
                class="button is-rounded is-shade-600 is-outlined"
                type="button"
                @click.prevent="removeWorkshop()"
              >
                <span class="icon">
                  <icon size="16" name="delete-bin-line" />
                </span>
                <span>Retirer un atelier</span>
              </button>
            </div>

            <button
              class="button is-rounded is-shade-600"
              type="button"
              :disabled="validateDisabled"
              @click.prevent="onSubmit"
            >
              <span>Valider</span>
              <span class="icon">
                <icon size="16" name="check" />
              </span>
            </button>
          </div>
        </div>
      </PageSection>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAssessmentStore } from "~/stores/assessmentStore"
import { useAnimatorStore } from "~/stores/animatorStore"
import { Workshop } from "~/composables/types"
import { useUserStore } from "~/stores/userStore"

definePageMeta({
  title: "Ateliers",
  breadcrumb: "Ateliers",
})

const assessmentStore = useAssessmentStore()
const animatorStore = useAnimatorStore()
const userStore = useUserStore()
const router = useRouter()

if (!assessmentStore.allInProgressAssessmentsLoaded) {
  assessmentStore.getInProgressAssessments()
}
if (!animatorStore.allWorkshopsLoaded) {
  animatorStore.getWorkshops()
}

const newWorkshops = ref<Workshop[]>([])

const validateDisabled = computed(() =>
  [...newWorkshops.value, ...animatorStore.workshops].some(
    (workshop) => !(workshop.assessmentId && workshop.date && workshop.name)
  )
)

function assessmentTitle(assessment) {
  return assessment?.municipality
    ? `Ville : ${assessment.municipality.name}`
    : `Inter-communalité : ${assessment.epci.name}`
}

function addWorkshop() {
  newWorkshops.value.push({
    id: undefined,
    assessmentId: undefined,
    name: "",
    date: "",
    animatorId: userStore.user.id,
    participants: [],
    changed: true,
  })
}

function removeWorkshop() {
  newWorkshops.value.pop()
}

async function saveAndAddParticipants(workshop) {
  const workshopResponse = await animatorStore.createOrUpdateWorkshop(workshop)
  if (workshopResponse) {
    router.push(`/profil/ateliers/${workshopResponse.id}/participants`)
  }
}

async function onSubmit() {
  for (const workshop of animatorStore.workshops) {
    await animatorStore.createOrUpdateWorkshop(workshop)
  }
  for (const workshop of newWorkshops.value) {
    await animatorStore.createOrUpdateWorkshop(workshop)
    newWorkshops.value.shift()
  }
}
</script>

<style scoped lang="sass"></style>
