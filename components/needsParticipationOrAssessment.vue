<template>
  <div>
    <template v-if="ready">
      <slot />
    </template>
    <template v-else>
      chargement...
    </template>
  </div>
</template>

<script setup lang="ts">
import { useAssessmentStore } from "~/stores/assessmentStore"
import { useParticipationStore } from "~/stores/participationStore"

const assessmentStore = useAssessmentStore()
const participationStore = useParticipationStore()
const route = useRoute()
const ready = ref(false)

const assessmentIdStr: string = ((route.params.assessmentId || route.query.assessment) as string)

if (assessmentIdStr) {
  const assessmentId = parseInt(assessmentIdStr)
  assessmentStore.currentAssessmentId = assessmentId
  if (!assessmentStore.currentAssessment) {
    await assessmentStore.getAssessment(assessmentId)
  }
  if (!participationStore.currentParticipationId || participationStore.currentParticipationId === -1) {
    await Promise.all([
      participationStore.getParticipationForAssessmentOnce(assessmentId),
      participationStore.loadAssessmentOnce(assessmentId),
    ])
  }
  ready.value = true
} else {
  ready.value = true
}

</script>
