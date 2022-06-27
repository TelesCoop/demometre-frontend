<template>
  <div class="container">
    <div class="section">
      <PageTitle title="Espace animateur" subtitle="" />
      <PageSection
        title="Ateliers"
        intro="Saisissez les ateliers que vous avez animé"
      >
        <div>
          <table class="table is-narrow is-fullwidth">
            <thead>
              <tr>
                <td></td>
                <td class="has-text-shade-400 is-uppercase is-size-6">
                  Nom de l’atelier
                </td>
                <td class="has-text-shade-400 is-uppercase is-size-6">Dates</td>
                <td class="has-text-shade-400 is-uppercase is-size-6">
                  Code postal
                </td>
              </tr>
            </thead>
            <tbody>
              <AccordionTable>
                <template #title>
                  <td>
                    <input
                      :class="`input is-shade-300`"
                      type="text"
                      placeholder="écrire ici ..."
                    />
                  </td>
                  <td>
                    <input
                      :class="`input is-shade-300`"
                      type="date"
                      placeholder="écrire ici ..."
                    />
                  </td>
                  <td>
                    <input
                      :class="`input is-shade-300`"
                      type="text"
                      placeholder="écrire ici ..."
                    />
                  </td>
                </template>
                <template #content>
                  <button
                    class="button is-rounded is-shade-600"
                    type="button"
                    @click.prevent=""
                  >
                    <span>Saisir les participant·e·s</span>
                    <span class="icon">
                      <icon size="16" name="user-add-line" />
                    </span>
                  </button>
                </template>
              </AccordionTable>
            </tbody>
          </table>
          <div class="buttons is-justify-content-space-between">
            <button
              class="button is-rounded is-shade-600 is-outlined"
              type="button"
              @click.prevent=""
            >
              <span class="icon">
                <icon size="16" name="add-line" />
              </span>
              <span>Ajouter un atelier</span>
            </button>
            <button
              class="button is-rounded is-shade-600"
              type="button"
              @click.prevent="onSubmit"
            >
              <span>Valider</span>
              <span class="icon">
                <icon size="16" name="check" />
              </span>
            </button>
          </div>
        </div>
      </PageSection>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: "Ateliers",
  breadcrumb: "Ateliers",
})

async function onSubmit() {
  // TODO : save workshops
}
</script>

<style scoped lang="sass"></style>
