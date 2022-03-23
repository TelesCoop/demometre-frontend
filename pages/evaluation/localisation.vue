<template>
  <div class="container">
    <section class="columns is-centered">
      <div class="column is-8">
        <h1 class="is-size-1">Localisation</h1>
        <!--  TODO changer texte p-->
        <p class="mb-3 is-family-secondary">
          Texte précisant la question (définition, exemple, reformulation) et
          pourquoi elle est posée.
        </p>

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
            <label class="label"
              >Êtes-vous intéressé·e par la démocratie dans votre commune ou
              votre intercommunalité&nbsp;?</label
            >
            <span class="is-family-secondary is-size-6"
              >Une intercommunalité est une forme de coopération entre plusieurs
              communes.</span
            >
            <div class="buttons mt-1">
              <div
                v-for="localityType of LocalityType"
                :key="localityType.key"
                class="locality-container"
              >
                <input
                  :id="localityType.key"
                  v-model="localityTypeSelected"
                  type="radio"
                  :value="localityType.key"
                  class="invisible"
                  name="localityType"
                  required
                />
                <label
                  :for="localityType.key"
                  class="button is-normal locality"
                >
                  {{ localityType.value }}
                </label>
              </div>
            </div>
          </div>

          <div class="buttons mt-4">
            <button class="button is-normal is-rounded">
              <span>Valider</span>
              <span class="icon">
                <icon height="18" width="24" name="check" />
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
// import CountrySelect from "~/components/country-select"
import { ref } from "@vue/reactivity"
import { useAssessmentStore } from "~/stores/assessmentStore"
import { LocalityType } from "~/composables/types"

const zipCode = ref("")
const localityTypeSelected = ref<string>()

const assessmentStore = useAssessmentStore()

async function onSubmit() {
  await assessmentStore.getOrCreateAssessment({
    zipCode: zipCode.value,
    localityType: localityTypeSelected.value,
  })
  const router = useRouter()
  router.push("/evaluation/assessment")
}
</script>

<style scoped lang="sass">
input:checked + label
  background-color: $black
  color: $white
.buttons .locality-container:not(:last-child):not(.is-fullwidth)
  margin-right: 0.5rem
</style>
