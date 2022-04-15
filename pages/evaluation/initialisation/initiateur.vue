<template>
  <div class="container">
    <section class="columns is-centered">
      <div class="column is-8">
        <h1 class="title is-3 has-text-black-ter">
          Lancement d'une nouvelle évaluation
        </h1>

        <form @submit.prevent="onSubmit">
          <div class="field my-3">
            <label class="label"
              >Au nom de qui lancez-vous cette évaluation &nbsp;?</label
            >
            <div class="buttons mt-1">
              <div
                v-for="initiatorType of InitiatorType"
                :key="initiatorType.key"
                class="margin-between"
              >
                <input
                  :id="initiatorType.key"
                  v-model="initiatorTypeSelected"
                  type="radio"
                  :value="initiatorType.key"
                  class="custom-hidden white-on-black-input-checked"
                  name="initiatorType"
                  required
                />
                <label
                  :for="initiatorType.key"
                  class="button is-normal locality"
                >
                  {{ initiatorType.value }}
                </label>
              </div>
            </div>
          </div>

          <div v-if="initiatorTypeSelected === InitiatorType.ASSOCIATION.key">
            <div class="field mb-3">
              <label class="label"
                >Quel est le nom de votre association ?</label
              >
              <div class="control">
                <input
                  v-model="associationName"
                  class="input is-normal-width"
                  type="text"
                  placeholder="Démocratie Ouverte"
                />
              </div>
            </div>
          </div>

          <div class="field mb-3">
            <label class="label">{{
              pageStore.evaluationInitPage.publicNameQuestion
            }}</label>
            <div class="buttons mt-1">
              <div
                v-for="(consentPublicName, index) of [true, false]"
                :key="index"
                class="margin-between"
              >
                <input
                  :id="consentPublicName"
                  v-model="consentPublicNameSelected"
                  type="radio"
                  :value="consentPublicName"
                  class="custom-hidden white-on-black-input-checked"
                  name="consentPublicName"
                  required
                />
                <label
                  :for="consentPublicName"
                  class="button is-normal locality"
                >
                  {{ consentPublicName ? "Oui" : "Non" }}
                </label>
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
  // TODO
}
</script>
