<template>
  <div class="container">
    <section v-if="title" class="section">
      <h3 v-if="isInsideBigSection" :class="titleClasses">{{ title }}</h3>
      <h1 v-else-if="isFirstElement" :class="titleClasses">{{ title }}</h1>
      <h2 v-else :class="titleClasses">{{ title }}</h2>
      <div
        class="is-flex is-flex-direction-row is-justify-content-space-between is-flex-wrap-wrap mb-3"
      >
        <p v-if="intro" class="is-family-secondary is-size-5 mb-1">
          {{ intro }}
        </p>
        <nuxt-link
          v-if="buttonLink && buttonText"
          class="button is-normal is-rounded is-responsive"
          :class="[
            buttonOutlined && `is-outlined`,
            buttonTextDark && ` has-text-${buttonColor}-dark`,
            ` is-${buttonColor}`,
          ]"
          :to="buttonLink"
        >
          <span v-if="!leftIcon">{{ buttonText }}</span>
          <span class="icon">
            <icon size="20" :name="icon" />
          </span>
          <span v-if="leftIcon">{{ buttonText }}</span>
        </nuxt-link>
      </div>
      <slot></slot>
    </section>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: { type: String, required: true },
  intro: { type: String, required: false, default: undefined },
  buttonText: { type: String, required: false, default: undefined },
  buttonLink: { type: String, required: false, default: undefined },
  buttonColor: { type: String, default: "shade-600" },
  buttonOutlined: { type: Boolean, default: false },
  buttonTextDark: { type: Boolean, default: false },
  leftIcon: { type: Boolean, default: false },
  icon: { type: String, default: "arrow-right-line" },
  isInsideBigSection: { type: Boolean, default: false },
  isFirstElement: { type: Boolean, default: false },
})

const titleClasses = ["title", "is-3", "has-text-shade-900", "mb-1"]
</script>

<style scoped lang="sass"></style>
