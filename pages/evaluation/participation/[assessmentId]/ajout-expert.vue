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
      <div v-else class="columns is-variable is-8">
        <div class="column is-half">
          <p class="has-text-weight-bold has-text-shade-800 mb-1">
            {{ pageStore.evaluationInitiationPage.chooseExpertText }}
          </p>
          <v-select
            v-model="expertSelected"
            label="name"
            :options="assessmentStore.experts"
          ></v-select>
        </div>
        <div class="column is-half">
          <p class="has-text-weight-bold has-text-shade-800 mb-1">
            {{ pageStore.evaluationInitiationPage.ifNoExpertText }}
          </p>
          <!-- Envoyer un mail -->
          <a
            class="button is-normal is-rounded"
            href="mailto:camille@telescoop.fr"
            target="_blank"
          >
            <span>Nous contactez</span>
            <span class="icon">
              <icon size="20" name="mail-line" />
            </span>
          </a>
        </div>
      </div>

      <button
        class="button is-normal is-rounded mt-4"
        @click.prevent="onSubmit"
      >
        <span>C’est parti !</span>
      </button>
    </PageSection>
  </div>
</template>

<script setup lang="ts">
import { usePageStore } from "~/stores/pageStore"
import { useAssessmentStore } from "~/stores/assessmentStore"
import { useUserStore } from "~/stores/userStore"
import vSelect from "vue-select"
import { User } from "~/composables/types"

definePageMeta({
  title: "Ajout d'un expert",
  breadcrumb: "Ajout d'un expert",
  step: "participation",
  middleware: ["assessment", "user-step"],
})

const route = useRoute()
const userStore = useUserStore()
const assessmentStore = useAssessmentStore()
const pageStore = usePageStore()
if (!pageStore.evaluationInitiationPage.initTitle) {
  pageStore.getEvaluationInitiationPage()
}
assessmentStore.getExperts()

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
