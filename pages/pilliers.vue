<template>
    <div style="margin: auto; max-width: 1200px; padding-top: 100px">
        <div style="display:flex">
            <Pillar
                v-for="name of names"
                :key="name"
                :name="name"
                :active="name === activePillar"
                @click="activePillar = name"
                style="cursor: pointer"
            />
        </div>
        <h2 class="title is-2">{{ title }}</h2>
    </div>
</template>

<script setup lang="ts">import { wordTitleCase } from '~~/utils';

const activePillar = ref("représentation")
const names = [
    'représentation',
    'transparence',
    'participation',
    'coopération',
]
const title = computed(() => wordTitleCase(activePillar.value))
</script>
