<template>
  <div class="container">
    <section v-if="props.title" class="section">
      <div />
      <h2 class="title is-3">{{ props.title }}</h2>
      <p class="is-family-secondary is-size-5 mb-3">
        {{ props.intro }}
      </p>
      <slot></slot>
    </section>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  title: { type: String, required: true },
  intro: { type: String, required: true },
})
</script>

<style scoped lang="sass"></style>
