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
      >
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
  </div>
</template>

<script setup lang="ts">
import { useAssessmentStore } from "~/stores/assessmentStore"
import { useUserStore } from "~/stores/userStore"
import { useProfilingStore } from "~/stores/profilingStore"
import { useParticipationStore } from "~/stores/participationStore"
import { AssessmentType } from "~/composables/types"
import { PARTICIPANT_TYPE } from "~/utils/constants"

definePageMeta({
  title: "Évaluation",
  breadcrumb: "Évaluation"
})

const assessmentStore = useAssessmentStore()
const profilingStore = useProfilingStore()
const participationStore = useParticipationStore()
const route = useRoute()
const userStep = useUserStep()

const assessmentId = parseInt(route.params.id as string)
assessmentStore.currentAssessmentId = assessmentId
const assessment = computed(() => assessmentStore.assessmentById[assessmentId])

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
</script>

<style scoped lang="sass"></style>
