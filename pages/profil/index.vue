<template>
  <div class="container">
    <div class="section">
      <PageTitle title="Mon compte" subtitle />
      <div class="buttons is-flex-direction-column is-align-items-flex-start">
        <router-link
          v-if="userStore.isUnknownUser"
          class="button is-primary mr-1 mb-1"
          to="/signup"
          >S'enregistrer pour conserver vos résultats</router-link
        >
        <NuxtLink
          v-if="userStore.isExpertUser"
          to="/profil/ateliers"
          class="button is-rounded"
          >Espace animateur</NuxtLink
        >
        <button class="button is-rounded" type="button" @click.prevent="logout">
          Se déconnecter
        </button>
      </div>
    </div>
    <div v-if="assessmentStore.currentAssessment">
      <PageSection title="Mon profil" intro="Vos informations personnelles">
        <div
          class="is-flex is-flex-wrap-wrap"
          style="row-gap: 1.5rem; column-gap: 3rem"
        >
          <div style="min-width: 200px">
            <p class="has-text-shade-400 is-uppercase is-size-6">mail</p>
            <p class="has-text-shade-600 is-size-5">
              {{ userStore.user.email }}
            </p>
          </div>
          <div style="min-width: 200px">
            <p class="has-text-shade-400 is-uppercase is-size-6">rôle</p>
            <p class="has-text-shade-600 is-size-5">
              {{
                profilingStore.roleById[participationStore.participation.roleId]
                  ?.name
              }}
            </p>
          </div>
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
      <PageSection
        title="Mon évaluation"
        intro="Nombre de questions répondues"
        button-text="Reprendre mon évaluation"
        :button-link="userStep.url"
        :button-outlined="true"
      >
        <QuestionnaireProgressBars class="mb-4" />
      </PageSection>
      <PageSection
        :title="assessmentStore.participationBoardTitle"
        :intro="assessmentStore.currentAssessment.municipality.name"
        button-text="Voir les résultats"
        button-link="/resultats"
        :button-outlined="true"
      >
        <ParticipationBoard
          :assessment="assessmentStore.currentAssessment"
        ></ParticipationBoard>
      </PageSection>
    </div>
    <div v-else>
      <PageSection
        title="Mon profil"
        intro="Vous n'avez pas d'évaluation en cours"
        button-text="Lancer l'évaluation"
        :button-link="userStep.url"
      ></PageSection>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAssessmentStore } from "~/stores/assessmentStore"
import { useUserStore } from "~/stores/userStore"
import { useProfilingStore } from "~/stores/profilingStore"
import { useParticipationStore } from "~/stores/participationStore"
import { getQuestionResponseString } from "~/utils/question-response"
import { useProfilingJourney } from "~/composables/journey"

definePageMeta({
  title: "Mon compte",
  breadcrumb: "Mon compte",
})

const assessmentStore = useAssessmentStore()
const profilingStore = useProfilingStore()
const participationStore = useParticipationStore()
const userStore = useUserStore()
const userStep = useUserStep()
const profilingJourney = useProfilingJourney()
if (!profilingStore.roles.length) {
  profilingStore.getRoles()
}

const getResponseString = (questionId) => {
  return getQuestionResponseString(
    profilingStore.questionById[questionId],
    participationStore.responseByProfilingQuestionId[questionId]
  )
}

const logout = () => {
  userStore.logout()
}
</script>

<style scoped lang="sass"></style>
