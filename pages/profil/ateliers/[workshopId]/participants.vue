<template>
  <div class="container">
    <div class="section">
      <PageTitle title="Espace animateur" subtitle />
      <PageSection
        title="Participant·e·s"
        :intro="`Saisissez les personnes ayant participées à votre atelier ${animatorStore.workshopById[workshopId].name}.`"
        button-text="Revenir aux ateliers"
        button-link="/profil/ateliers"
        :left-icon="true"
        icon="arrow-left-line"
      >
        <div>
          <table class="table is-narrow is-fullwidth">
            <thead>
              <tr>
                <td></td>
                <td class="has-text-shade-400 is-uppercase is-size-6">
                  Prénom nom
                </td>
                <td class="has-text-shade-400 is-uppercase is-size-6">Mail</td>
                <td class="has-text-shade-400 is-uppercase is-size-6">Rôle</td>
              </tr>
            </thead>
            <tbody>
              <AccordionTable
                v-for="(participation, index) of [
                  ...animatorStore.workshopParticipations(workshopId),
                  ...newParticipations,
                ]"
                :id="index"
                :key="index"
              >
                <template #title>
                  <td>
                    <input
                      v-model="participation.participantName"
                      :class="`input is-shade-300`"
                      type="text"
                      placeholder="écrire ici ..."
                      @change="participation.changed = true"
                    />
                  </td>
                  <td>
                    <input
                      v-model="participation.participantEmail"
                      :class="`input is-shade-300`"
                      type="email"
                      placeholder="écrire ici ..."
                      @change="participation.changed = true"
                    />
                  </td>
                  <td>
                    <div class="select">
                      <select
                        v-model="participation.roleId"
                        @change="participation.changed = true"
                      >
                        <option
                          v-for="role in profilingStore.roles"
                          :key="role.id"
                          :value="role.id"
                        >
                          {{ role.name }}
                        </option>
                      </select>
                    </div>
                  </td>
                </template>
                <template #content>
                  <div>
                    <div
                      class="is-flex is-flex-wrap-wrap"
                      style="row-gap: 1.5rem; column-gap: 1.5rem"
                    >
                      <div
                        v-for="questionId in profilingStore.orderedQuestionId"
                        :key="questionId"
                        style="min-width: 200px"
                      >
                        <p class="has-text-shade-400 is-uppercase is-size-7">
                          {{ profilingStore.questionById[questionId].name }}
                        </p>
                        <ResponseAnimator
                          v-model="
                            participation.responseByQuestionId[questionId]
                          "
                          :question="profilingStore.questionById[questionId]"
                          :participation="participation"
                          :assessment-id="
                            animatorStore.workshopById[workshopId].assessmentId
                          "
                          color="no-pillar"
                          @change="participation.changed = true"
                        />
                      </div>
                    </div>
                    <div class="has-text-right mt-1_5">
                      <button
                        class="button is-rounded is-shade-600 is-outlined"
                        type="button"
                        :disabled="
                          !(
                            participation.participantName &&
                            participation.roleId
                          )
                        "
                        @click.prevent="saveParticipation(participation)"
                      >
                        <span>Valider le profil</span>
                        <span class="icon">
                          <icon size="16" name="check" />
                        </span>
                      </button>
                    </div>
                  </div>
                </template>
              </AccordionTable>
            </tbody>
          </table>
          <div class="buttons is-justify-content-space-between">
            <div>
              <button
                class="button is-rounded is-shade-600 is-outlined"
                type="button"
                @click.prevent="addParticipation()"
              >
                <span class="icon">
                  <icon size="16" name="add-line" />
                </span>
                <span>Ajouter un·e participant·e</span>
              </button>
              <button
                v-if="newParticipations.length"
                class="button is-rounded is-shade-600 is-outlined"
                type="button"
                @click.prevent="removeParticipation()"
              >
                <span class="icon">
                  <icon size="16" name="delete-bin-line" />
                </span>
                <span>Retirer un·e participant·e</span>
              </button>
            </div>

            <button
              class="button is-rounded is-shade-600"
              type="button"
              :disabled="validateDisabled"
              @click.prevent="onSubmit"
            >
              <span>Valider les participant·e·s</span>
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
import { useProfilingStore } from "~/stores/profilingStore"
import { WorkshopParticipation } from "~/composables/types"
import { Ref, ref } from "@vue/reactivity"
import { useAnimatorStore } from "~~/stores/animatorStore"

definePageMeta({
  title: "Participants",
  breadcrumb: "Participants",
  middleware: ["animator-space"],
})

const profilingStore = useProfilingStore()
const animatorStore = useAnimatorStore()
const route = useRoute()
const router = useRouter()
const workshopId: Ref<number> = ref(+route.params.workshopId)

if (!profilingStore.roles.length) {
  profilingStore.getRoles()
}
if (
  !animatorStore.workshopById[workshopId.value] ||
  animatorStore.workshopById[workshopId.value].participationIds.length !==
    animatorStore.workshopParticipations(workshopId.value).length
) {
  animatorStore.getWorkshop(workshopId.value)
}

const newParticipations = ref<WorkshopParticipation[]>([])

const validateDisabled = computed(() =>
  [
    ...newParticipations.value,
    ...animatorStore.workshopParticipations(workshopId.value),
  ].some(
    (participation) =>
      !(participation?.participantName && participation?.roleId)
  )
)

function addParticipation() {
  newParticipations.value.push({
    id: undefined,
    assessmentId: animatorStore.workshopById[workshopId.value].assessmentId,
    roleId: undefined,
    participantName: "",
    participantEmail: "",
    responses: undefined,
    responseByQuestionId: {},
    changed: true,
  })
}

function removeParticipation() {
  newParticipations.value.pop()
}

async function saveParticipation(participation) {
  await animatorStore.createOrUpdateParticipation(
    participation,
    workshopId.value
  )
  if (!participation.id) {
    newParticipations.value.shift()
  }
}

async function onSubmit() {
  const newParticipationsTmp = newParticipations.value
  for (const participation of [
    ...animatorStore.workshopParticipations(workshopId.value),
    ...newParticipationsTmp,
  ]) {
    if (!participation.id) {
      newParticipations.value.shift()
    }
    if (participation.changed) {
      await animatorStore.createOrUpdateParticipation(
        participation,
        workshopId.value
      )
    }
  }
  router.push(`/profil/ateliers/${workshopId.value}/reponses`)
}
</script>

<style scoped lang="sass"></style>
