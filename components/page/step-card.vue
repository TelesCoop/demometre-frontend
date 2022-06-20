<template>
  <div :class="`card has-background-${backgroundColor} is-fullheight`">
    <div class="card-image">
      <figure class="image is-4by3">
        <img
          :src="MADIA_BASE_URL + props.step.imageUrl"
          alt=""
          :style="`max-height: ${props.imageHeight}px`"
        />
      </figure>
      <div class="step-number-container is-flex flex-center">
        <span
          class="is-size-5 has-background-shade-800 has-text-white is-flex flex-center step-number"
          >{{ props.index + 1 }}</span
        >
      </div>
    </div>
    <div class="card-content p-2">
      <div class="mb-1_5">
        <p
          class="is-size-4 has-text-shade-600 has-text-weight-bold has-text-centered"
        >
          {{ props.step.title }}
        </p>
      </div>
      <div class="content">
        <p class="is-family-secondary is-size-6 has-text-shade-600">
          {{ props.step.description }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MADIA_BASE_URL } from "~/composables/api"

const props = defineProps({
  step: { type: Object, required: true },
  backgroundColor: { type: String, required: true },
  imageHeight: { type: Number, required: true },
  index: { type: Number, required: true },
})
</script>

<style scoped lang="sass">
img
  width: 100%
  object-fit: cover
.step-number
  border-radius: 6px
  height: 40px
  width: 40px
  &-container
    margin-top: -25px
</style>
