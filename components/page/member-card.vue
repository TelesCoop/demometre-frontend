<template>
  <div :class="`card is-fullheight`">
    <div class="card-content">
      <div class="media is-flex is-flex-direction-row mb-1_5">
        <div v-if="props.persons.imageUrl" class="media-left mr-1">
          <figure class="image is-48x48 is-rounded">
            <img
              :src="MADIA_BASE_URL + props.persons.imageUrl"
              :alt="props.persons.personName"
            />
          </figure>
        </div>
        <div class="media-content">
          <p class="has-text-shade-600 has-text-weight-bold">
            {{ props.persons.name }}
          </p>
          <p class="subtitle is-family-secondary is-6">
            {{ props.persons.jobTitle }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MADIA_BASE_URL } from "~/composables/api"

const props = defineProps({
  persons: { type: Object, required: true },
})
</script>

<style scoped lang="sass">
.image
  max-height: 48px
  max-width: 48px
  img
    border-radius: 50%
</style>
