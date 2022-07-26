<template>
  <div>
    <div class="columns is-variable is-8">
      <div class="column is-half">
        <p class="has-text-weight-bold has-text-shade-800 mb-1">
          {{ props.initiationPage.chooseExpertText }}
        </p>
        <v-select
          v-model="expertSelected"
          label="name"
          :options="assessmentStore.experts"
        ></v-select>
      </div>
      <div class="column is-half">
        <p class="has-text-weight-bold has-text-shade-800 mb-1">
          {{ props.initiationPage.ifNoExpertText }}
        </p>
        <!-- Envoyer un mail -->
        <a
          class="button is-normal is-rounded"
          :href="`mailto:${settingsStore.structureSettings.email}`"
          target="_blank"
        >
          <span>Nous contactez</span>
          <span class="icon">
            <icon size="20" name="mail-line" />
          </span>
        </a>
      </div>
    </div>
    <button class="button is-normal is-rounded mt-4" @click.prevent="onSubmit">
      <span>C’est parti !</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { PropType } from "vue"
import { useAssessmentStore } from "~/stores/assessmentStore"
import { User, EvaluationInitiationPage } from "~/composables/types"
import vSelect from "vue-select"
import { useSettingStore } from "~~/stores/settingStore"

const props = defineProps({
  assessmentId: { type: String, required: true },
  initiationPage: {
    type: Object as PropType<EvaluationInitiationPage>,
    required: true,
  },
  redirectAfterValidation: { type: String, required: true },
})

const assessmentStore = useAssessmentStore()
const settingsStore = useSettingStore()
assessmentStore.getExperts()

const expertSelected = ref<User>()

async function onSubmit() {
  const isSuccess = await assessmentStore.addExpert(
    props.assessmentId,
    expertSelected.value.id
  )
  if (isSuccess) {
    assessmentStore.addingExpert = false
    useRouter().push(props.redirectAfterValidation)
  }
}
</script>
