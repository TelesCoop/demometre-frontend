<template>
  <div>
    <PageSection
      class="column is-8"
      :title="
        pageStore.evaluationInitiationPage.createAssessmentWithExpertTitle
      "
      :intro="
        pageStore.evaluationInitiationPage.createAssessmentWithExpertDescription
      "
      :is-first-element="true"
      :intro-is-rich-text="true"
    >
      <div v-if="!userStore.isLoggedIn" class="buttons mb-0_5">
        <!-- User not logged in -->
        <p>Vous devez être connecté pour ajouter un expert</p>
        <NuxtLink class="button is-normal is-rounded" to="/signup"
          >Faire un compte</NuxtLink
        >
        <NuxtLink class="button is-normal is-rounded" to="/login"
          >Se connecter</NuxtLink
        >
      </div>
      <AssessmentAddExpert
        v-else
        v-model="expertSelected"
        :initiation-page="pageStore.evaluationInitiationPage"
      />
      <button
        class="button is-normal is-rounded mt-4"
        :disabled="disabled"
        @click.prevent="onSubmit"
      >
        <span>C’est parti !</span>
      </button>
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

async function onSubmit() {
  const isSuccess = await assessmentStore.addExpert(
    +route.params.assessmentId,
    expertSelected.value.id
  )
  if (isSuccess) {
    assessmentStore.addingExpert = false
    useRouter().push(
      `/evaluation/participation/${assessmentStore.currentAssessmentId}/tableau-de-bord`
    )
  }
}
</script>
