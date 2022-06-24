<template>
  <section class="section">
    <div class="container">
      <h2 class="title is-size-2-tablet is-size-3-mobile has-text-black mb-1">
        {{ props.title }}
      </h2>
      <hr class="has-text-shade-350" />
    </div>
    <slot></slot>
  </section>
</template>

<script setup lang="ts">
const props = defineProps({
  title: { type: String, required: true },
})
</script>

<style scoped lang="sass"></style>
