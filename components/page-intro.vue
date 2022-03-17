<template>
  <section class="intro-text mb-6">
    <h1 class="title is-1-desktop is-2 has-text-black-bis">{{ title }}</h1>
    <div class="is-family-secondary is-size-5 is-size-4-desktop">
      {{ introduction }}
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue"

const props = defineProps({
  title: { type: String, require: true },
  introduction: { type: String, required: true },
})
</script>

<style scoped lang="sass">
.intro-text
  @include desktop
    margin-right: 60px
</style>
