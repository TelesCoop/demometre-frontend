<template>
  <div class="container">
    <section class="columns section"></section>
    <section ref="pillarsRef" class="columns is-multiline mt-4"></section>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router"
import { ref, onMounted } from "vue"
import { useQuestionnaireStore } from "~/stores/questionnaireStore"
import { usePageStore } from "~/stores/pageStore"
import { Marker, PillarType } from "~/composables/types"

definePageMeta({
  title: "Utilisations possibles",
  breadcrumb: "Utilisations possibles",
})

const router = useRouter()

const pageStore = usePageStore()

if (!pageStore.usagePage.title) {
  pageStore.getUsagePage()
}
</script>

<style scoped lang="sass">
.buttons .button
  height: fit-content
</style>
