<template>
  <div class="container is-fluid">
    <form
      class="column is-one-third is-offset-one-third"
      action="/evaluation/localisation"
      @submit.prevent="onSubmit"
    >
      <h1 class="title is-3 has-text-black-ter">Commencer une évaluation</h1>
      <div class="buttons mt-4">
        <button class="button is-normal is-rounded">
          <span>Commencer</span>
        </button>
        <span class="is-size-7 hidden-in-mobile-mode">
          appuyez sur
          <span class="has-text-weight-bold">Entrer ⏎</span>
        </span>

        <!-- Permet d'appuyer sur entrer -->
        <input type="submit" hidden />
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: "Évaluation",
  breadcrumb: "Évaluation",
  step: "localisation",
  middleware: ["user-step"],
})

function onSubmit() {
  useRouter().push("/evaluation/localisation")
}
</script>

<style scoped lang="sass"></style>
