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
                v-for="(participant, index) of [
                  ...animatorStore.workshopParticipants(workshopId),
                  ...newParticipants,
                ]"
                :id="index"
                :key="index"
              >
                <template #title>
                  <td>
                    <input
                      v-model="participant.userUsername"
                      :class="`input is-shade-300`"
                      type="text"
                      placeholder="écrire ici ..."
                      @change="participant.changed = true"
                    />
                  </td>
                  <td>
                    <input
                      v-model="participant.userEmail"
                      :class="`input is-shade-300`"
                      type="email"
                      placeholder="écrire ici ..."
                      @change="participant.changed = true"
                    />
                  </td>
                  <td>
                    <div class="select">
                      <select
                        v-model="participant.roleId"
                        @change="participant.changed = true"
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
                          v-model="participant.responseByQuestionId[questionId]"
                          :question="profilingStore.questionById[questionId]"
                          :participant="participant"
                          :assessment-id="
                            animatorStore.workshopById[workshopId].assessmentId
                          "
                          color="no-pillar"
                          @change="participant.changed = true"
                        />
                      </div>
                    </div>
                    <div class="has-text-right mt-1_5">
                      <button
                        class="button is-rounded is-shade-600 is-outlined"
                        type="button"
                        :disabled="
                          !(participant.userUsername && participant.roleId)
                        "
                        @click.prevent="saveParticipant(participant)"
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
                @click.prevent="addParticipant()"
              >
                <span class="icon">
                  <icon size="16" name="add-line" />
                </span>
                <span>Ajouter un·e participant·e</span>
              </button>
              <button
                v-if="newParticipants.length"
                class="button is-rounded is-shade-600 is-outlined"
                type="button"
                @click.prevent="removeParticipant()"
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
import { Participant } from "~/composables/types"
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
  animatorStore.workshopById[workshopId.value].participantIds.length !==
    animatorStore.workshopParticipants(workshopId.value).length
) {
  animatorStore.getWorkshop(workshopId.value)
}

const newParticipants = ref<Participant[]>([])

const validateDisabled = computed(() =>
  [
    ...newParticipants.value,
    ...animatorStore.workshopParticipants(workshopId.value),
  ].some((participant) => !(participant?.userUsername && participant?.roleId))
)

function addParticipant() {
  newParticipants.value.push({
    id: undefined,
    assessmentId: animatorStore.workshopById[workshopId.value].assessmentId,
    roleId: undefined,
    userEmail: "",
    userUsername: "",
    responses: undefined,
    responseByQuestionId: {},
    changed: true,
  })
}

function removeParticipant() {
  newParticipants.value.pop()
}

async function saveParticipant(participant) {
  await animatorStore.createOrUpdateParticipant(participant, workshopId.value)
  if (!participant.id) {
    newParticipants.value.shift()
  }
}

async function onSubmit() {
  const newParticipantsTmp = newParticipants.value
  for (const participant of [
    ...animatorStore.workshopParticipants(workshopId.value),
    ...newParticipantsTmp,
  ]) {
    if (!participant.id) {
      newParticipants.value.shift()
    }
    if (participant.changed) {
      await animatorStore.createOrUpdateParticipant(
        participant,
        workshopId.value
      )
    }
  }
  router.push(`/profil/ateliers/${workshopId.value}/reponses`)
}
</script>

<style scoped lang="sass"></style>
