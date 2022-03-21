<template>
  <div class="container">
    <h1 class="is-size-1">Localisation</h1>
    <!--  TODO changer texte p-->
    <p class="mb-3">
      Texte précisant la question (définition, exemple, reformulation) et
      pourquoi elle est posée.
    </p>

    <form>
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
            class="input"
            type="text"
            placeholder="Text input"
            @input="onInputZipCode"
          />
        </div>
      </div>
    </form>

    <div v-if="assessmentStore.assessments?.length" class="field mb-3">
      <label class="label"
        >Êtes-vous intéressé·e par la démocratie dans votre commune ou votre
        intercommunalité&nbsp;?</label
      >
      <div class="buttons">
        <a
          v-if="assessmentStore.municipalityAssessment"
          class="button is-normal"
          >Commune</a
        >
        <a
          v-if="assessmentStore.intercommunalityAssessment"
          class="button is-normal"
          >Intercommunalité</a
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// import CountrySelect from "~/components/country-select"
import { ref } from "@vue/reactivity"
import { useAssessmentStore } from "~/stores/assessmentStore"

const zipCode = ref("")
let timeout

const assessmentStore = useAssessmentStore()

async function onInputZipCode() {
  if (timeout) {
    clearTimeout(timeout)
  }
  timeout = setTimeout(async () => {
    await assessmentStore.loadAssessments({ zipCode: zipCode.value })
  }, 300)
}
</script>
