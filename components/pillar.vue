<template>
    <div
        class="pillar-card"
        :class="isHovered ? `has-background-${colorClass}-light` : ''"
        @mouseenter="isHovered = true"
        @mouseleave="isHovered = false"
    >
        <div :class="circleClass" class="pillar-circle">{{ letter }}</div>
        <p :class="`has-text-${colorClass} is-size-4 mt-3`">{{ textTitle }}</p>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue"

const colorClassFromName = {
    "représentation": "success",
    "transparence": "info",
    "participation": "link",
    "coopération": "danger",
}

const props = defineProps({ name: { type: String, required: true }, active: { default: true } })
const isHovered = ref(false);
const a = () => { let b = 23; return 35 }

const colorClass = computed(() => colorClassFromName[props.name])
const letter = computed(() => props.name[0].toUpperCase())
const textTitle = computed(() => letter.value + props.name.slice(1))
const circleClass = computed(() => {
    props.active
    let toReturn = `pillar-circle has-border-${colorClass.value} `

    let other = (
        props.active
            ? `has-background-${colorClass.value} has-text-white`
            : `has-background-${colorClass.value}-light has-text-${colorClass.value}`
    )
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