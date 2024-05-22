<template>
  <div>
    <FormPaperQuestion
      :question="question"
      color="no-pillar"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, PropType } from "vue"
import {
  PillarParams,
  type PillarType,
  type Question,
} from "~/composables/types"

const props = defineProps({
  pillar: {
    type: Object as PropType<PillarType>,
    required: true,
  },
  question: {
    type: Object as PropType<Question>,
    required: true,
  },
})
</script>
