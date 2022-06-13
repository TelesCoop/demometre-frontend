<template>
  <div class="container">
    <section v-if="props.title" class="section">
      <div />
      <h2 class="title is-3 has-text-shade-900 mb-1">{{ props.title }}</h2>
      <div
        class="is-flex is-flex-direction-row is-justify-content-space-between"
      >
        <p class="is-family-secondary is-size-5 mb-3">
          {{ props.intro }}
        </p>
        <nuxt-link
          v-if="props.buttonLink && props.buttonText"
          :class="`button is-shade-600 has-text-white is-normal is-rounded is-responsive`"
          :to="props.buttonLink"
        >
          <span>{{ props.buttonText }}</span>
          <span class="icon">
            <icon size="20" name="arrow-right-line" />
          </span>
        </nuxt-link>
      </div>
      <slot></slot>
    </section>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  title: { type: String, required: true },
  intro: { type: String, required: true },
  buttonText: { type: String, required: false },
  buttonLink: { type: String, required: false },
})
</script>

<style scoped lang="sass"></style>
