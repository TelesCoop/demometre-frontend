<template>
  <div
    class="pillar-card"
    :class="
      (isHovered ? `has-background-${colorClass}-light` : '') +
      ` is-${colorClass}`
    "
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <div :class="circleClass" class="pillar-circle">
      <img :src="picto" class="picto" />
    </div>
    <p :class="`has-text-${colorClass}-dark is-size-4-tablet is-size-5-mobile`">
      {{ textTitle }}
    </p>
    <span :class="`icon has-text-${colorClass}`">
      <icon size="24" name="arrow-right-line" />
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"

const props = defineProps({
  name: { type: String, required: true },
  active: { default: true },
})
const isHovered = ref(false)

const colorClass = computed(() => PillarParams[props.name].color)
const picto = computed(() => "assets/img/" + PillarParams[props.name].picto)
const textTitle = computed(
  () => props.name[0].toUpperCase() + props.name.slice(1)
)
const circleClass = computed(() => {
  props.active
  let toReturn = `pillar-circle has-border-${colorClass.value} `

  let other = props.active
    ? `has-background-${colorClass.value} has-text-white`
    : `has-background-${colorClass.value}-light has-text-${colorClass.value}`
  return `${toReturn} ${other}`
})
</script>

<style scoped lang="sass">
.pillar-card
  width: 270px
  height: 184px
  display: flex
  flex-direction: column
  align-items: center
  padding: 24px
  flex-grow: 0
  flex-shrink: 0

.pillar-circle
  width: 88px
  height: 88px
  border-radius: 100%
  font-size: 40px
  text-align: center
  padding-top: 12px
  margin-bottom: 0.75rem

.picto
  max-width: 60px
  max-height: 45px

.icon
  display: none

@include mobile
  .pillar-card
    display: flex
    flex-direction: row
    padding: 1rem
    background-color: var(--color-light)
    justify-content: flex-start
    column-gap: 1rem
    height: fit-content
    width: auto
    margin: 0 2rem
    position: relative
  .icon
    display: block
    position: absolute
    right: 1rem
    svg
      vertical-align: middle

  .pillar-circle
    width: 48px
    height: 48px
    border-radius: 100%
    font-size: 24px
    text-align: center
    padding-top: 6px
    margin-bottom: 0rem
  .picto
    max-width: 30px
    max-height: 25px
</style>
