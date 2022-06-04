<template>
  <div
    :class="`card has-background-${backgroundColor} is-fullheight is-clickable`"
  >
    <div class="card-content">
      <div class="media is-flex is-flex-direction-row mb-1_5">
        <div v-if="props.feedback.pictureUrl" class="media-left mr-1">
          <figure class="image is-48x48 is-rounded">
            <img :src="BASE_URL + props.feedback.pictureUrl" alt="" />
          </figure>
        </div>
        <div class="media-content">
          <p class="has-text-shade-600 has-text-weight-bold">
            {{ props.feedback.personName }}
          </p>
          <p class="subtitle is-family-secondary is-6">
            {{ props.feedback.personContext }}
          </p>
        </div>
      </div>
      <div class="content is-family-secondary is-size-6">
        {{ props.feedback.quote }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BASE_URL } from "~/composables/api"

const props = defineProps({
  feedback: { type: Object, required: true },
  backgroundColor: { type: String, required: true },
})
</script>

<style scoped lang="sass">
.image
  max-height: 48px
  max-width: 48px
  img
    border-radius: 50%
</style>
