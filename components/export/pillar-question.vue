<template>
  <div>
    <FormPaperQuestion
      :question="question"
      :color="color"
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

const color = computed<string>(() => PillarParams[props.pillar.name].color)
</script>
