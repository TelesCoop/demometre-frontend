<template>
  <div class="container">
    <div class="section">
      <PageTitle title="Espace animateur" subtitle="" />
      <PageSection
        title="Ateliers"
        intro="Saisissez les ateliers que vous avez animé"
        button-text="Revenir aux ateliers"
        button-link="/profil/ateliers"
      >
        <div class="buttons is-justify-content-space-between">
          <button
            class="button is-rounded is-shade-600 is-outlined"
            type="button"
            @click.prevent=""
          >
            <span class="icon">
              <icon size="16" name="add-line" />
            </span>
            <span>Ajouter un·e participant·e</span>
          </button>
          <button
            class="button is-rounded is-shade-600"
            type="button"
            @click.prevent="onSubmit"
          >
            <span>Valider les participant·e·s</span>
            <span class="icon">
              <icon size="16" name="check" />
            </span>
          </button>
        </div>
      </PageSection>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: "Participants",
  breadcrumb: "Participants",
})

async function onSubmit() {
  // TODO : save participants
}
</script>

<style scoped lang="sass"></style>
