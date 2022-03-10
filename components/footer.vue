<template>
  <div style="padding: 64px; background: #fafafa">
    <div class="container">
      <div class="columns">
        <div class="column footer-column is-3">
          <NuxtLink to="/" class="has-text-weight-bold">
            Titre du projet
          </NuxtLink>
          <NuxtLink to="/">2022 - licence contenu</NuxtLink>
          <NuxtLink to="/">Mentions légales</NuxtLink>
          <NuxtLink to="/">Politique de confidentialité</NuxtLink>
        </div>
        <div class="column footer-column is-3">
          <NuxtLink to="/">Le référentiel</NuxtLink>
          <NuxtLink to="/">Options d'évaluation</NuxtLink>
          <NuxtLink to="/">Résultats</NuxtLink>
          <NuxtLink to="/">Le projet</NuxtLink>
        </div>
        <div class="column footer-column is-3">
          <NuxtLink to="/">Blog</NuxtLink>
          <NuxtLink to="/">Ressources</NuxtLink>
          <NuxtLink to="/">FAQ</NuxtLink>
          <NuxtLink to="/">Contact</NuxtLink>
        </div>
        <div class="column footer-column is-3">
          <label class="label is-size-7" for="email"
            >Lettre d'information</label
          >
          <div class="field has-addons">
            <div class="control">
              <input
                id="email"
                v-model="email"
                class="input is-small"
                type="text"
                placeholder="prenom@laposte.fr"
              />
            </div>
            <div class="control">
              <button type="button" class="button is-info is-small">
                Je m'abonne
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const email = ref("")
</script>

<style>
.footer-column {
  display: flex;
  flex-direction: column;
}
.footer-column a {
  color: black;
  font-weight: 400;
  font-size: 0.75rem !important;
}
.footer-column a + a {
  margin-top: 8px;
}
</style>
