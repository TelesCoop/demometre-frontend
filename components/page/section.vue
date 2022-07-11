<template>
  <div class="container">
    <section v-if="props.title" class="section">
      <h3 v-if="props.isInsideBigSection" :class="titleClasses">
        {{ props.title }}
      </h3>
      <h2 v-else :class="titleClasses">{{ props.title }}</h2>
      <div
        class="is-flex is-flex-direction-row is-justify-content-space-between is-flex-wrap-wrap mb-3"
      >
        <p v-if="props.intro" class="is-family-secondary is-size-5 mb-1">
          {{ props.intro }}
        </p>
        <nuxt-link
          v-if="props.buttonLink && props.buttonText"
          class="button is-normal is-rounded is-responsive"
          :class="[
            props.buttonOutlined && `is-outlined`,
            props.buttonTextDark && ` has-text-${buttonColor}-dark`,
            ` is-${props.buttonColor}`,
          ]"
          :to="props.buttonLink"
        >
          <span v-if="!props.leftIcon">{{ props.buttonText }}</span>
          <span class="icon">
            <icon size="20" :name="props.icon" />
          </span>
          <span v-if="props.leftIcon">{{ props.buttonText }}</span>
        </nuxt-link>
      </div>
      <slot></slot>
    </section>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
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
})

const titleClasses = ["title", "is-3", "has-text-shade-900", "mb-1"]
</script>

<style scoped lang="sass"></style>
