<template>
  <section class="intro-text mb-3">
    <h1 class="title is-size-1-desktop is-2 has-text-black">{{ title }}</h1>
    <div class="is-family-secondary is-size-5 is-size-4-desktop">
      {{ subtitle }}
    </div>
  </section>
</template>

<script setup lang="ts">
const props = defineProps({
  title: { type: String, require: true },
  subtitle: { type: String, required: true },
})
</script>

<style scoped lang="sass">
.intro-text
  @include desktop
    margin-right: 60px
</style>
