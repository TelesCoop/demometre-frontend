<template>
  <div>
    <label class="label has-text-shade-800">{{
      pageStore.evaluationInitiationPage.consentTitle
    }}</label>
    <span class="is-family-secondary is-size-6 has-text-shade-600">{{
      pageStore.evaluationInitiationPage.consentDescription
    }}</span>
    <label class="checkbox is-size-7 mt-1">
      <input
        v-model="participationStore.newParticipation.consent"
        type="checkbox"
        required
      />
      En cochant cette case, vous confirmez avoir pris connaissance des
      <a
        :href="MADIA_BASE_URL + settingStore.rgpdSettings.termsOfUseUrl"
        target="_blank"
        class="is-underlined"
        >conditions générales d’utilisations</a
      >
      et des règles d’accessibilité du DémoMètre.
    </label>
  </div>
</template>

<script setup lang="ts">
import { MADIA_BASE_URL } from "~/composables/api"
import { usePageStore } from "~/stores/pageStore"
import { useSettingStore } from "~/stores/settingStore"
import { useParticipationStore } from "~/stores/participationStore"

const settingStore = useSettingStore()
const pageStore = usePageStore()
const participationStore = useParticipationStore()
</script>

<style scoped lang="sass"></style>
