<template>
  <div class="container">
    <div class="section">
      <PageTitle title="Espace animateur" />
      <PageSection
        title="Ateliers"
        intro="Saisissez les ateliers que vous avez animés"
      >
        <div>
          <table class="table is-narrow is-fullwidth">
            <thead>
              <tr>
                <td class="has-text-shade-400 is-uppercase is-size-6">
                  Nom de l’atelier
                </td>
                <td class="has-text-shade-400 is-uppercase is-size-6">
                  Date (MM/JJ/AAAA)
                </td>
                <td class="has-text-shade-400 is-uppercase is-size-6">
                  Evaluation*
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
                    :timezone="true"
                    lang="fr-FR"
                  />
                </td>
                <td>
                  <div class="select">
                    <select v-model="workshop.assessmentId">
                      <option
                        v-for="assessment of animatorStore.assessments"
                        :key="assessment.id"
                        :value="assessment.id"
                      >
                        {{ assessmentTitle(assessment) }}
                      </option>
                    </select>
                  </div>
                </td>
                <td style="text-align: end; vertical-align: middle">
                  <div
                    v-if="!workshop.closed"
                    class="buttons is-justify-content-flex-end"
                  >
                    <button
                      class="button is-rounded is-shade-600 is-outlined"
                      type="button"
                      :disabled="
                        !(
                          workshop.name &&
                          workshop.date &&
                          workshop.assessmentId
                        )
                      "
                      @click.prevent="saveAndGoToParticipants(workshop)"
                    >
                      <span>Saisir les participant·e·s</span>
                      <span class="icon">
                        <icon size="16" name="user-add-line" />
                      </span>
                    </button>
                    <button
                      class="button is-rounded is-shade-600 is-outlined js-modal-trigger"
                      :disabled="!workshop.id"
                      @click.prevent="closeWorkshopIdModal = workshop.id"
                    >
                      <span>Clôturer l'atelier</span>
                    </button>
                  </div>
                  <div v-else>
                    <span class="tag is-shade-500">
                      Atelier clôturé
                      <icon size="16" name="check" />
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <p class="mb-1 is-size-7 has-text-shade-400">
            *Seulement les ateliers des évaluations dont la redevance à été
            réglée sont visibles ici
          </p>
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
    <div
      id="modal-validate-workshop"
      class="modal"
      :class="closeWorkshopIdModal && `is-active`"
    >
      <div class="modal-background" @click.prevent="closeModal()"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Clôturer l'atelier</p>
          <button
            class="button is-ghost is-rounded is-outlined"
            @click.prevent="closeModal()"
          >
            <icon size="20" name="close" />
          </button>
        </header>
        <section class="modal-card-body">
          <div>
            Vous vous apprêtez à clôturer l'atelier afin que le calcul des
            résultats soit mis à jour et que les utilisateurs puissent récupérer
            les informations de leur participation. Attention: il ne sera plus
            possible de faire de modification sur cet atelier
          </div>
        </section>
        <footer class="modal-card-foot">
          <button
            class="button is-success"
            @click.prevent="closeWorkshop(workshop)"
          >
            Clôturer
          </button>
          <button class="button" @click.prevent="closeModal()">Annuler</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAnimatorStore } from "~/stores/animatorStore"
import { Workshop } from "~/composables/types"
import { useUserStore } from "~/stores/userStore"

definePageMeta({
  title: "Ateliers",
  breadcrumb: "Ateliers",
  middleware: ["animator-space"],
})

const animatorStore = useAnimatorStore()
const userStore = useUserStore()
const router = useRouter()

if (!animatorStore.allAssessmentsLoaded) {
  animatorStore.getAnimatorAssessments()
}
if (!animatorStore.allWorkshopsLoaded) {
  animatorStore.getWorkshops()
}

const closeWorkshopIdModal = ref<number>(undefined)
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
    participationIds: [],
    changed: true,
    closed: false,
  })
}

function removeWorkshop() {
  newWorkshops.value.pop()
}

function closeModal() {
  closeWorkshopIdModal.value = undefined
}

async function saveAndGoToParticipants(workshop) {
  if (!workshop.id) {
    newWorkshops.value.shift()
  }
  const workshopResponse = await animatorStore.createOrUpdateWorkshop(workshop)

  if (workshopResponse) {
    await animatorStore.getWorkshop(workshopResponse.id)
    router.push(`/profil/ateliers/${workshopResponse.id}/participants`)
  }
}

async function onSubmit() {
  const newWorkshopsTmp = newWorkshops.value
  for (const workshop of [...animatorStore.workshops, ...newWorkshopsTmp]) {
    if (!workshop.id) {
      newWorkshops.value.shift()
    }
    if (workshop.changed) {
      await animatorStore.createOrUpdateWorkshop(workshop)
    }
  }
}

async function closeWorkshop() {
  await animatorStore.closeWorkshop(closeWorkshopIdModal.value)
  closeModal()
}
</script>

<style scoped lang="sass"></style>
