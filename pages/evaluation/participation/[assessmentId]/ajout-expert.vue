<template>
  <div>
    <PageSection
      class="column is-8 questionnaire-container"
      :title="
        pageStore.evaluationInitiationPage.createAssessmentWithExpertTitle
      "
      :intro="
        pageStore.evaluationInitiationPage.createAssessmentWithExpertDescription
      "
      :is-first-element="true"
      :intro-is-rich-text="true"
    >
      <div class="nav-questionnaire-container">
        <div v-if="!userStore.isLoggedIn">
          <!-- User not logged in -->
          <p class="mb-1">Vous devez être connecté pour ajouter un expert</p>
          <div class="buttons mb-0_5">
            <NuxtLink class="button is-shade-600 is-rounded" to="/signup"
              >Créer un compte</NuxtLink
            >
            <NuxtLink class="button is-shade-600 is-rounded" to="/login"
              >Se connecter</NuxtLink
            >
          </div>
        </div>
        <AssessmentAddExpert
          v-else
          v-model="expertSelected"
          :initiation-page="pageStore.evaluationInitiationPage"
        />
        <ButtonsArrowButton
          color="no-pillar"
          class="arrow-button-fixed is-left"
          @click.prevent="goBack"
        />
        <button
          class="button is-shade-600 is-rounded mt-4"
          :disabled="disabled"
          @click.prevent="onSubmit"
        >
          <span>C’est parti !</span>
        </button>
      </div>
    </PageSection>
  </div>
</template>

<script setup lang="ts">
import { usePageStore } from "~/stores/pageStore"
import { useUserStore } from "~/stores/userStore"
import { useAssessmentStore } from "~/stores/assessmentStore"
import { User } from "~/composables/types"

definePageMeta({
  title: "Ajout d'un expert",
  breadcrumb: "Ajout d'un expert",
  step: "participation",
  middleware: ["assessment", "user-step"],
})

const router = useRouter()
const assessmentStore = useAssessmentStore()

const disabled = computed(() =>
  assessmentStore.newAssessment.conditionsOfSaleConsent ? false : true
)

const route = useRoute()
const userStore = useUserStore()
const pageStore = usePageStore()
if (!pageStore.evaluationInitiationPage.initTitle) {
  pageStore.getEvaluationInitiationPage()
}

const expertSelected = ref<User>()

function goBack() {
  router.push(
    `/evaluation/participation/${assessmentStore.currentAssessmentId}`
  )
}

async function onSubmit() {
  const isSuccess = await assessmentStore.addExpert(
    +route.params.assessmentId,
    expertSelected.value.id
  )
  if (isSuccess) {
    assessmentStore.addingExpert = false
    useRouter().push(
      `/evaluation/participation/${assessmentStore.currentAssessmentId}/role`
    )
  }
}
</script>
