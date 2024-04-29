<template>
  <div class="container">
    <div class="section">
      <h1 class="title is-1 has-text-black">
        Générer un questionnaire papier
      </h1>
      <div>
        <FormLocalisation @submit="onSubmit" />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
definePageMeta({
  title: "Mon compte",
  breadcrumb: "Mon compte",
})

const onSubmit = () => {
  console.log("test")
}
</script>
