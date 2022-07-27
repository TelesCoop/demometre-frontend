<template>
  <PageSection
    class="column is-8"
    :title="pageStore.evaluationInitiationPage.searchAssessmentTitle"
    :intro="pageStore.evaluationInitiationPage.searchAssessmentDescription"
    :is-first-element="true"
  >
    <form @submit.prevent="onSubmit">
      <!--      <div class="field mb-6">-->
      <!--        <label class="label">Dans quel pays habitez-vous ?</label>-->
      <!--        <div class="control">-->
      <!--          <div class="select">-->
      <!--            <CountrySelect>-->
      <!--              <option>Sélectionnez votre pays</option>-->
      <!--            </CountrySelect>-->
      <!--          </div>-->
      <!--        </div>-->
      <!--      </div>-->

      <div class="field mb-3">
        <label class="label">Code postal</label>
        <div class="control">
          <input
            v-model="zipCode"
            class="input is-normal-width"
            type="text"
            placeholder="Code postal"
            required
          />
        </div>
      </div>

      <div class="field mb-3">
        <label class="label">
          Êtes-vous intéressé·e par la démocratie dans votre commune ou votre
          intercommunalité&nbsp;?
        </label>
        <span class="is-family-secondary is-size-6">
          Une intercommunalité est une forme de coopération entre plusieurs
          communes.
        </span>
        <div class="buttons mt-1">
          <div
            v-for="localityType of LocalityType"
            :key="localityType.key"
            class="margin-between"
          >
            <input
              :id="localityType.key"
              v-model="localityTypeSelected"
              type="radio"
              :value="localityType.key"
              class="custom-hidden white-on-black-input-checked"
              name="localityType"
              required
            />
            <label :for="localityType.key" class="button is-normal locality">{{
              localityType.value
            }}</label>
          </div>
        </div>
      </div>

      <div class="buttons mt-4">
        <button class="button is-normal is-rounded" :disabled="disabled">
          <span>Valider</span>
          <span class="icon">
            <icon size="24" name="check" />
          </span>
        </button>

        <!-- Permet d'appuyer sur entrer -->
        <input type="submit" hidden />
      </div>
    </form>
  </PageSection>
</template>

<script setup lang="ts">
import { ref } from "@vue/reactivity"
import { useAssessmentStore } from "~/stores/assessmentStore"
import { LocalityType } from "~/composables/types"
import { usePageStore } from "~/stores/pageStore"

definePageMeta({
  title: "Localisation",
  step: "localisation",
  middleware: ["user-step"],
})

const pageStore = usePageStore()

if (!pageStore.evaluationInitiationPage.searchAssessmentTitle) {
  pageStore.getEvaluationInitiationPage()
}

const zipCode = ref("")
const localityTypeSelected = ref<string>()
const disabled = computed(() =>
  zipCode.value && localityTypeSelected.value ? false : true
)

const assessmentStore = useAssessmentStore()

async function onSubmit() {
  const isSuccess = await assessmentStore.getOrCreateAssessment({
    zipCode: zipCode.value,
    localityType: localityTypeSelected.value,
  })
  if (isSuccess) {
    if (!assessmentStore.currentAssessment?.initializationDate) {
      useRouter().push(
        `/evaluation/initialisation?assessment=${assessmentStore.currentAssessmentId}`
      )
    } else {
      useRouter().push(
        `/evaluation/participation/${assessmentStore.currentAssessmentId}`
      )
    }
  }
}
</script>
