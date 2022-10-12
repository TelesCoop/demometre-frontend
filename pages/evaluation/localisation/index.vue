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
        <label class="label">
          {{
            pageStore.evaluationInitiationPage
              .searchAssessmentLocalityTypeQuestion
          }}
        </label>
        <span class="is-family-secondary is-size-6">
          {{
            pageStore.evaluationInitiationPage
              .searchAssessmentLocalityTypeDescription
          }}
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
            <label
              :for="localityType.key"
              class="button is-shade-600 is-outlined locality"
              >{{ localityType.value }}</label
            >
          </div>
        </div>
      </div>

      <div class="field mb-3">
        <label class="label">
          {{
            pageStore.evaluationInitiationPage.searchAssessmentZipCodeQuestion
          }}
        </label>
        <span class="is-family-secondary is-size-6">
          {{
            pageStore.evaluationInitiationPage
              .searchAssessmentZipCodeDescription
          }}
        </span>
        <div class="control mt-1">
          <input
            v-model="zipCode"
            class="input is-normal-width"
            type="text"
            placeholder="Code postal"
            required
          />
          <button
            class="pagination-next button is-outlined is-shade-600"
            style="border-color: transparent"
            :disabled="!zipCode"
            @click.prevent="searchLocalities"
          >
            <span class="icon">
              <icon size="20" name="search" />
            </span>
          </button>
        </div>
        <p
          v-if="!localitiesToShow.length && searched"
          class="is-family-secondary is-size-6bis mt-1"
        >
          {{ pageStore.evaluationInitiationPage.searchAssessmentNoResult }}
        </p>
      </div>

      <div class="field mb-3">
        <div class="buttons mt-1">
          <div
            v-for="locality of localitiesToShow"
            :key="locality.name"
            class="margin-between"
          >
            <input
              :id="locality.name"
              v-model="localityId"
              type="radio"
              :value="locality.id"
              class="custom-hidden white-on-black-input-checked"
              name="locality"
              required
            />
            <label
              :for="locality.name"
              class="button is-shade-600 is-outlined locality"
              >{{ locality.name }}</label
            >
          </div>
        </div>
      </div>

      <div class="buttons mt-4">
        <button class="button is-shade-600 is-rounded" :disabled="disabled">
          <span>Valider</span>
          <span class="icon">
            <icon size="20" name="check" />
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
import { Localities, LocalityType } from "~/composables/types"
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
const localityId = ref<number>()
const localities = ref<Localities>({
  municipality: [],
  intercommunality: [],
})
const searched = ref<number>(0)
const localitiesToShow = computed(() =>
  localityTypeSelected.value
    ? localities.value[localityTypeSelected.value]
    : Object.values(localities.value).flat()
)
const disabled = computed(() =>
  zipCode.value && localityId.value ? false : true
)

const assessmentStore = useAssessmentStore()

async function searchLocalities() {
  localities.value = await assessmentStore.getLocalities(zipCode.value)
  searched.value = 1
  localityId.value = undefined
}

async function onSubmit() {
  const isSuccess = await assessmentStore.getOrCreateAssessment({
    localityId: localityId.value,
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
