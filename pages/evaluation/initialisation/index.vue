<template>
  <div class="container">
    <section class="columns is-centered">
      <div class="column is-8">
        <h1 class="title is-3 has-text-black-ter">
          {{ pageStore.evaluationInitPage.title }}
        </h1>
        <RichText
          :rich-text="pageStore.evaluationInitPage.introduction"
          class="mb-3 is-family-secondary"
        />

        <NuxtLink
          class="button is-normal is-rounded mt-4"
          to="/evaluation/initialisation/initiateur"
          ><span>Initialiser une évaluation</span>
          <span class="icon"> <icon size="24" name="arrow-right-line" /> </span
        ></NuxtLink>
        <form>
          <input type="submit" hidden />
        </form>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { usePageStore } from "~/stores/pageStore"

definePageMeta({
  title: "Initialisation",
  breadcrumb: "Initialisation",
})

const pageStore = usePageStore()
if (!pageStore.evaluationInitPage.title) {
  pageStore.loadEvaluationInitPage()
}

onMounted(() => {
  window.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      useRouter().push(`/evaluation/initialisation/initiateur`)
    }
  })
})
</script>


<style scoped lang="sass"></style>
