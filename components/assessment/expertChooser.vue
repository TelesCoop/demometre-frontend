<template>
  <div class="field">
    <label class="label">Expert {{ expertIx + 1 }}</label>
    <div class="select">
      <select
        id="workshop_type"
        v-model="selectedExpertId"
        name="workshop_type"
      >
        <option
          v-for="expert of assessmentStore.experts"
          :key="expert.id"
          :value="expert.id"
        >
          {{ expert.username }} ({{ expert.email }})
        </option>
      </select>
    </div>
    <div class="mt-0_5">
      <button
        class="button is-small is-rounded is-black is-outlined"
        @click="$emit('remove')"
      >
        Retirer cet expert
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAssessmentStore } from "~/stores/assessmentStore"

const props = defineProps({
  modelValue: { type: Number, required: true },
  expertIx: { type: Number, default: 0 }
})
defineEmits(["remove", "update:modelValue"])

const assessmentStore = useAssessmentStore()
const selectedExpertId = useModel("modelValue")
</script>
