<template>
  <div
    class="pillar-card"
    :class="isHovered ? `has-background-${colorClass}-light` : ''"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <div :class="circleClass" class="pillar-circle">
      <img :src="picto" width height="40" />
    </div>
    <p :class="`has-text-${colorClass} is-size-4 mt-3`">{{ textTitle }}</p>
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

<style>
.pillar-card {
  width: 270px;
  height: 184px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
  flex-grow: 0;
  flex-shrink: 0;
}
.pillar-circle {
  width: 88px;
  height: 88px;
  border-radius: 100%;
  font-size: 40px;
  text-align: center;
  padding-top: 12px;
}
</style>
