<template>
  <div class="container">
    <section class="columns is-centered">
      <div class="column is-8">
        <h1 class="title is-3 has-text-black-ter">
          Limite pour la publication des résultats
        </h1>

        <!-- <ResponseInputPercentage
          v-for=""
          v-model="answer"
          :color="props.color"
          :question-id="1"
        /> -->
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { usePageStore } from "~/stores/pageStore"
import { InitiatorType } from "~/composables/types"

definePageMeta({
  title: "Initialisation",
  breadcrumb: "Initialisation",
})

const pageStore = usePageStore()
if (!pageStore.evaluationInitPage.title) {
  pageStore.loadEvaluationInitPage()
}

const initiatorTypeSelected = ref<string>()
const consentPublicNameSelected = ref<boolean>()
const associationName = ref<string>()
const disabled = computed(() =>
  initiatorTypeSelected.value &&
  consentPublicNameSelected.value !== undefined &&
  (initiatorTypeSelected.value === InitiatorType.ASSOCIATION.key
    ? associationName.value
    : true)
    ? false
    : true
)

async function onSubmit() {
  const isSuccess = await assessmentStore.getOrCreateAssessment({
    zipCode: zipCode.value,
    localityType: localityTypeSelected.value,
  })
  if (isSuccess) {
    useRouter().push(
      `/evaluation/localisation/${assessmentStore.currentAssessmentId}`
    )
  }
}
</script>
