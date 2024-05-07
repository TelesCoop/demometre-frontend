<template>
  <div class="container">
    <div class="section">
      <h1 class="title is-1 has-text-black">
        Générer un questionnaire papier
      </h1>
      <div>
        <h2 class="title is-3">
          Choisissez un role
        </h2>
        <FormRole
          v-model="answer"
          :is-loading="isLoading"
          @submit="onSubmit"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { Localities } from "~/composables/types"

definePageMeta({
  title: "Questionnaire papier",
  breadcrumb: "Questionnaire papier",
  middleware: ["admin-or-expert"],
})

const router = useRouter()
const answer = ref<number | undefined>(undefined)
const isLoading = ref(false)
const onSubmit = (value?: Localities) => {
  if (!value) return
  isLoading.value = true
  router.push(`/export/questionnaire/${value}`)
}
</script>
