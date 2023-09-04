<template>
  <div
    v-if="assessment"
    class="container"
  >
    <div class="mb-2">
      <NuxtLink
        class="button is-white is-rounded"
        to="/compte"
      >
        <span class="icon">
          <icon
            size="20"
            name="arrow-left-line"
          />
        </span>
        <span>
          Revenir à mon compte
        </span>
      </NuxtLink>
    </div>
    <div class="is-flex is-justify-content-space-between is-align-items-center">
      <h1 class="title is-1">
        {{ assessment?.name }}
      </h1>
      <div>
        <span
          v-if="assessment.isCurrent"
          class="tag is-light is-medium"
        >
          <span>Évaluation en cours</span>
          <icon
            size="20"
            name="loader-2-line"
            style="margin-left: 4px"
          />
        </span>
        <span
          v-else
          class="tag is-light is-info is-medium"
        ><span>Évaluation terminée</span>
          <icon
            size="20"
            name="check"
            style="margin-left: 4px"
          />
        </span>
      </div>
    </div>

    <div>
      <hr>
      <PageSection
        title="Informations"
        :buttons="assessment.details.hasDetailAccess ? [{text: 'Modifier les informations', icon: 'list-settings-line'}, {text: 'Changer d\'expert', icon: 'user-2-line'}] : []"
        @button-click="onInformationButtonClick"
      >
        <div
          v-if="assessment.details.hasDetailAccess"
          style="margin-top: -32px;margin-bottom: 32px;"
        >
          <span class="tag is-light is-medium">
            <template
              v-if="assessment.details.role! === 'initiator'"
            >Vous êtes à l'intiative de cette évaluation</template>
            <template v-if="assessment.details.role === 'expert'">Vous êtes l'expert de cette évaluation</template>
          </span>
        </div>
        <div
          class="is-flex is-flex-wrap-wrap"
          style="row-gap: 3rem; column-gap: 3rem"
        >
          <InformationDetail
            title="type d'évaluation"
            :value="AssessmentType[assessment.assessmentType.toUpperCase()].value"
          />
          <InformationDetail
            title="lancée le"
            :value="new Date(assessment.created).toLocaleDateString()"
          />
          <InformationDetail
            v-if="assessment.initializedToTheNameOf"
            title="par"
            :value="assessment.initializedToTheNameOf"
          />
          <InformationDetail
            title="localité"
            :value="assessment.collectivityName"
          />
          <InformationDetail
            title="Mon rôle"
            :value="PARTICIPANT_TYPE[assessment.role]"
          />
          <InformationDetail
            title="participants"
            :value="assessment.participationCount"
          />
          <InformationDetail
            title="ateliers"
            :value="assessment.workshopCount"
          />
        </div>
        <div
          v-if="assessment.details.hasDetailAccess"
          class="mt-3"
        >
          <div class="columns">
            <div class="column is-6-tablet">
              <InformationRichDetail
                title="Contexte"
                :value="assessment.context"
              />
            </div>
            <div class="column is-6-tablet">
              <InformationRichDetail
                title="Objectifs"
                :value="assessment.objectives"
              />
            </div>
          </div>
          <div class="columns">
            <div class="column is-6-tablet">
              <InformationRichDetail
                title="Parties prenantes"
                :value="assessment.stakeholders"
              />
            </div>
            <div class="column is-6-tablet">
              <InformationRichDetail
                title="Calendrier"
                :value="assessment.calendar"
              />
            </div>
          </div>
        </div>
      </PageSection>
      <section class="section">
        <div class="is-flex is-justify-content-space-between">
          <div>
            <h2 class="title is-3 has-text-shade-900 mb-1">
              État de l'évaluation
            </h2>
            <p class="is-size-5">
              Nombre de questions répondues : {{ participationStore.status.answered }} /
              {{ participationStore.status.total }}
            </p>
          </div>
          <div>
            <NuxtLink
              :to="userStep.url"
              class="button is-rounded is-dark"
            >
              <span>Reprendre l'évaluation</span>
              <span class="icon"><icon
                size="20"
                name="arrow-right-line"
              /></span>
            </NuxtLink>
            <NuxtLink
              :to="`/resultats/${assessmentId}`"
              class="button is-rounded ml-1"
            >
              <span>Voir les résultats</span>
              <span class="icon"><icon
                size="20"
                name="bar-chart-line"
              /></span>
            </NuxtLink>
          </div>
        </div>
        <div>
          <QuestionnaireProgressBars class="mb-3" />
          <ParticipationBoard
            :assessment="assessmentStore.currentAssessment"
          />
        </div>
      </section>
    </div>
    <InformationsEditModal
      v-if="showInformationsEditModal"
      :assessment="assessment"
      @close="showInformationsEditModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { useAssessmentStore } from "~/stores/assessmentStore"
import { useProfilingStore } from "~/stores/profilingStore"
import { useParticipationStore } from "~/stores/participationStore"
import { Assessment } from "~/composables/types"
import { PARTICIPANT_TYPE } from "~/utils/constants"
import InformationsEditModal from "~/components/assessment/informationsEditModal.vue"

definePageMeta({
  title: "Évaluation",
  breadcrumb: "Évaluation"
})

const assessmentStore = useAssessmentStore()
const profilingStore = useProfilingStore()
const participationStore = useParticipationStore()
const route = useRoute()
const userStep = useUserStep()
const showInformationsEditModal = ref(true)
const showExpertsEditModal = ref(false)

const assessmentId = parseInt(route.params.id as string)
assessmentStore.currentAssessmentId = assessmentId
const assessment = computed<Assessment>(() => assessmentStore.assessmentById[assessmentId])

if (!profilingStore.roles.length) {
  profilingStore.getRoles()
}
if (participationStore.currentlyLoadedResponsesAssessmentId !== assessmentId) {
  participationStore.getParticipationForAssessment(assessmentId)
  participationStore.getProfilingQuestionResponsesForAssessment(assessmentId)
  await participationStore.getQuestionnaireSubjectiveQuestionResponsesForAssessment(assessmentId)
}
if (participationStore.status.total == 0) {
  await participationStore.getParticipationForAssessment(assessmentId)
  await participationStore.setTotalAndAnsweredQuestionsByPillarName()
}

const onInformationButtonClick = (buttonIx: number) => {
  if (buttonIx === 0) {
    console.log("### 0")
    showInformationsEditModal.value = true
  } else if (buttonIx === 1) {
    console.log("### 1")
    showExpertsEditModal.value = true
  }
}
</script>

<style scoped lang="sass"></style>
