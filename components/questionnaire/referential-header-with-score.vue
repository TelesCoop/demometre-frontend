<template>
  <header>
    <div class="is-flex is-justify-content-space-between">
      <h2 class="title is-4 mb-0_75">{{ props.title }}</h2>
      <AnalyticsScore
        v-if="props.showScore && !isNullOrUndefined(props.score)"
        :score="props.score"
        :color="props.color"
        :size-circles="16"
        size-number-class="is-size-4"
      />
    </div>
    <hr class="my-0_75" />
  </header>
</template>

<script setup lang="ts">
import { isNullOrUndefined } from "assets/utils"

const props = defineProps({
  title: { type: String, required: true },
  color: { type: String, required: true },
  showScore: { type: Boolean, default: false },
  score: { type: Number, required: false, default: undefined },
})
</script>
