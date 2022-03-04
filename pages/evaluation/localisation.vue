<template>
  <div class="container">
    <h1 class="is-size-1">Localisation</h1>
    <!--  TODO changer texte p-->
    <p class="mb-6">Texte précisant la question (définition, exemple, reformulation) et pourquoi elle est posée.</p>

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

      <div class="field mb-6">
        <label class="label">Code postal</label>
        <div class="control">
          <input class="input" type="text" placeholder="Text input" @input="onInputZipCode" v-model="zipCode">
        </div>
      </div>
    </form>

    <div class="field mb-6" v-if="assessmentStore.assessments?.length">
      <label class="label">Êtes-vous intéressé·e par la démocratie dans votre commune ou votre intercommunalité?</label>
      <div class="buttons">
        <a class="button is-normal" v-if="assessmentStore.municipalityAssessment">Commune</a>
        <a class="button is-normal" v-if="assessmentStore.intercommunalityAssessment">Intercommunalité</a>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import {ref} from "@vue/reactivity";
import {useAssessmentStore} from "~/stores/assessmentStore";

const zipCode = ref("")
let timeout

const assessmentStore = useAssessmentStore()

async function onInputZipCode() {
   if (timeout) {
     clearTimeout(timeout)
   }
   timeout = setTimeout(async () => {
     await assessmentStore.loadAssessments({zipCode: zipCode.value})
   }, 300)
}
</script>
