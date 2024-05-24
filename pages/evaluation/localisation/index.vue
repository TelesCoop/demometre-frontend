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
            >
            <label
              :for="localityType.key"
              class="button is-shade-600 is-outlined locality"
            >{{ localityType.value }}</label>
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
            @keyup.enter.stop="searchLocalities"
          >
          <button
            type="button"
            class="pagination-next button is-outlined is-shade-600"
            style="border-color: transparent"
            :disabled="!zipCode"
            @click="searchLocalities"
          >
            <span>Rechercher</span>
            <span class="icon">
              <icon
                size="20"
                name="search"
              />
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
              @click="localityTypeSelected = locality.localityType"
            >
            <label
              :for="locality.name"
              class="button is-shade-600 is-outlined locality"
            >{{ locality.name }}</label>
          </div>
        </div>
      </div>

      <div class="buttons mt-4">
        <button
          class="button is-shade-600 is-rounded"
          :disabled="disabled"
          type="submit"
        >
          <span>Valider</span>
          <span class="icon">
            <icon
              size="20"
              name="check"
            />
          </span>
        </button>
        <span
          v-if="canPressEnter()"
          class="is-size-7 is-hidden-mobile"
        >
          appuyez sur
          <span class="has-text-weight-bold">Entrer ⏎</span>
        </span>
      </div>
    </form>
  </PageSection>
</template>

<script setup lang="ts">
import { useAssessmentStore } from "~/stores/assessmentStore"
import {
  Localities,
  Locality,
  LocalityType,
  SurveysResult,
} from "~/composables/types"
import { usePageStore } from "~/stores/pageStore"
import { usePressEnter } from "~/composables/pressEnter"

definePageMeta({
  title: "Localisation",
  step: "localisation",
})

const pageStore = usePageStore()
const router = useRouter()

if (!pageStore.evaluationInitiationPage.searchAssessmentTitle) {
  pageStore.getEvaluationInitiationPage()
}

const zipCode = ref("")
const localityTypeSelected = ref<
  "region" | "municipality" | "intercommunality"
>()
const localityId = ref<number>()
const localities = ref<Localities>({
  municipality: [],
  intercommunality: [],
})
const regions = ref<Locality[]>([])
const searched = ref<number>(0)
const localitiesToShow = computed(() => {
  if (!localityTypeSelected.value) {
    console.log("###", Object.values(localities.value), [
      ...Object.values(localities.value),
      regions.value,
    ])
    return [...Object.values(localities.value), regions.value].flat()
  }
  if (localityTypeSelected.value === "region") {
    return regions.value
  } else {
    return localities.value[localityTypeSelected.value]
  }
})
const disabled = computed(() => !localityId.value)

const assessmentStore = useAssessmentStore()

async function searchLocalities() {
  const res: SurveysResult | null = await assessmentStore.getSurveysForZipCode(
    zipCode.value,
  )
  if (!res) {
    return
  }
  localities.value = res.city
  regions.value = res.region
  searched.value = 1
  localityId.value = undefined
}

async function onSubmit() {
  // avoid submit
  if (disabled.value) {
    return
  }
  const isSuccess = await assessmentStore.getOrCreateAssessment({
    localityId: localityId.value,
    localityType: localityTypeSelected.value,
  })
  if (isSuccess) {
    if (!assessmentStore.currentAssessment?.initializationDate) {
      router.push(
        `/evaluation/initialisation?assessment=${assessmentStore.currentAssessmentId}`,
      )
    } else {
      router.push(
        `/evaluation/participation/${assessmentStore.currentAssessmentId}`,
      )
    }
  }
}

const canPressEnter = () => !disabled.value
usePressEnter(onSubmit, canPressEnter)
</script>
