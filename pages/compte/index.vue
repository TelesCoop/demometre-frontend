<template>
  <div class="container">
    <div class="section">
      <div class="is-flex is-justify-content-space-between">
        <h1 class="title is-size-1-desktop is-2 has-text-black">
          Mon compte
        </h1>
        <div>
          <button
            class="button is-rounded"
            @click.prevent="logout"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
    <div
      v-if="userStore.isUnknownUser || true"
      class="section"
      style="margin-top: -64px"
    >
      <div class="message">
        <div class="message-body">
          Votre participation ne sera pas comptabilisée tant que vous n'êtes pas
          enregistré. Elle sera supprimée au bout d'un mois.
        </div>
      </div>
      <div class="buttons is-flex-direction-column is-align-items-flex-start">
        <router-link

          class="button is-rounded is-primary mr-1 mb-1"
          to="/signup"
        >
          S'enregistrer pour conserver vos résultats
        </router-link>
      </div>
    </div>
    <div>
      <hr>
      <PageSection
        title="Mes informations"
        :buttons="[{text: 'Modifier les informations', icon: 'list-settings-line'}]"
        @button-click="showEditUserInfoModal = true"
      >
        <div
          class="is-flex is-flex-wrap-wrap"
          style="row-gap: 1.5rem; column-gap: 3rem"
        >
          <InformationDetail
            title="Nom"
            :value="userStore.user.username"
          />
          <InformationDetail
            title="mail"
            :value="userStore.user.email"
          />
          <div
            v-for="questionId in profilingJourney.journey.value"
            :key="questionId"
            style="min-width: 200px"
          >
            <p class="has-text-shade-400 is-uppercase is-size-6">
              {{ profilingStore.questionById[questionId].name }}
            </p>
            <p class="has-text-shade-600 is-size-5">
              {{ getResponseString(questionId) }}
            </p>
          </div>
        </div>
      </PageSection>
      <hr>
      <PageSection
        title="Mes évaluations"
        intro="Toutes mes évaluations en cours et terminées"
        :buttons="[{text: 'Lancer une évaluation', link: `/evaluation/localisation`, icon: 'arrow-right-line'}]"
      >
        <div class="tabs is-fullwidth">
          <ul>
            <li
              :class="isCurrentAssessmentsTab ? 'is-active' : null"
              @click="isCurrentAssessmentsTab = true"
            >
              <a>Évaluations en cours ({{ currentAssessments.length }})</a>
            </li>
            <li
              :class="isCurrentAssessmentsTab ? null : 'is-active'"
              @click="isCurrentAssessmentsTab = false"
            >
              <a>Évaluations terminées ({{ finishedAssessments.length }})</a>
            </li>
          </ul>
        </div>
        <div>
          <article
            v-if="!selectedAssessments.length"
            class="message"
          >
            <div class="message-body">
              <p class="title is-5">
                Aucune évaluation {{ isCurrentAssessmentsTab ? "en cours" : "terminée" }}
              </p>
              <p>
                Vous n’avez aucune évaluation {{ isCurrentAssessmentsTab ? "en cours" : "terminée" }} avec le DémoMètre.
              </p>
              <p>
                Pour démarrer une évaluation, cliquer sur le bouton « Lancer une évaluation ».
              </p>
            </div>
          </article>
          <table
            v-else
            class="table is-striped is-fullwidth"
          >
            <thead>
              <tr>
                <th>Nom</th>
                <th>Date de création</th>
                <th>Rôle</th>
                <th>Code INSEE</th>
                <th>Localité</th>
                <th>Pays</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="assessment of selectedAssessments"
                :key="assessment.id"
                style="cursor: pointer"
                tabindex="0"
                title="Cliquer pour accéder aux détails"
                @click="selectAssessment(assessment.id)"
              >
                <td>{{ assessment.name }}</td>
                <td>{{ new Date(assessment.created).toLocaleDateString() }}</td>
                <td>
                  {{ PARTICIPANT_TYPE[assessment.details.role] || "inconnu" }}
                  <template v-if="assessment.details.hasDetailAccess">
                    <span
                      v-if="assessment.details.paymentAmount"
                      class="tag"
                    >Redevance payée</span>
                    <span
                      v-else
                      class="tag is-danger"
                    >Redevance impayée</span>
                  </template>
                </td>
                <td>{{ assessment.code }}</td>
                <td>{{ assessment.collectivityName }}</td>
                <td>France</td>
                <td>
                  <button class="button is-small is-rounded">
                    Détails
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </PageSection>
    </div>
    <AccountEditUserInfoModal
      v-if="showEditUserInfoModal"
      @close="showEditUserInfoModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { useAssessmentStore } from "~/stores/assessmentStore"
import { useUserStore } from "~/stores/userStore"
import { useProfilingStore } from "~/stores/profilingStore"
import { useParticipationStore } from "~/stores/participationStore"
import { getQuestionResponseString } from "~/utils/question-response"
import { useProfilingJourney } from "~/composables/journey"
import { PARTICIPANT_TYPE } from "~/utils/constants"

definePageMeta({
  title: "Mon compte",
  breadcrumb: "Mon compte"
})

const assessmentStore = useAssessmentStore()
const profilingStore = useProfilingStore()
const participationStore = useParticipationStore()
const userStore = useUserStore()
const router = useRouter()
const profilingJourney = useProfilingJourney()
if (!profilingStore.roles.length) {
  profilingStore.getRoles()
}

const isCurrentAssessmentsTab = ref(true)
const showEditUserInfoModal = ref(false)

const currentAssessments = computed(() => assessmentStore.assessments.filter(ass => ass.isCurrent))
const finishedAssessments = computed(() => assessmentStore.assessments.filter(ass => !ass.isCurrent))
const selectedAssessments = computed(() => isCurrentAssessmentsTab.value ? currentAssessments.value : finishedAssessments.value)

const getResponseString = (questionId) => {
  return getQuestionResponseString(
    profilingStore.questionById[questionId],
    participationStore.responseByProfilingQuestionId[questionId]
  )
}
const selectAssessment = (assessmentId: number) => {
  router.push(`/compte/evaluation/${assessmentId}`)
}

const logout = () => {
  userStore.logout()
}
</script>

<style scoped lang="sass"></style>
