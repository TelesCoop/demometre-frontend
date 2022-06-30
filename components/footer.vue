<template>
  <footer class="footer has-background-shade-600">
    <div class="container">
      <div class="columns">
        <div class="column footer-column is-3">
          <NuxtLink to="/" class="has-text-weight-bold has-text-shade-200">
            DémoMètre
          </NuxtLink>
          <NuxtLink to="/" class="has-text-shade-350"
            >2022 - licence contenu</NuxtLink
          >
          <a
            class="has-text-shade-350"
            :href="MADIA_BASE_URL + settingStore.rgpdSettings.legalMentionUrl"
            target="_blank"
          >
            Mentions légales
          </a>
          <a
            class="has-text-shade-350"
            :href="
              MADIA_BASE_URL +
              settingStore.rgpdSettings.confidentialityPolicyUrl
            "
            target="_blank"
          >
            Politique de confidentialité
          </a>
        </div>
        <div class="column footer-column is-3">
          <NuxtLink to="/demometre" class="has-text-white">DémoMètre</NuxtLink>
          <NuxtLink to="/utilisations-possibles" class="has-text-white"
            >Utilisations possibles</NuxtLink
          >
          <NuxtLink to="/" class="has-text-white">Résultats</NuxtLink>
          <NuxtLink to="/projet" class="has-text-white">Le projet</NuxtLink>
        </div>
        <div class="column footer-column is-3">
          <NuxtLink to="/blog" class="has-text-white">Blog</NuxtLink>
          <NuxtLink to="/ressources" class="has-text-white"
            >Ressources</NuxtLink
          >
          <NuxtLink to="/" class="has-text-white">FAQ</NuxtLink>
          <NuxtLink to="/" class="has-text-white">Contact</NuxtLink>
        </div>
        <div class="column footer-column is-3">
          <!-- <label class="label is-size-7" for="email"
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
          </div> -->
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { MADIA_BASE_URL } from "~/composables/api"
import { useSettingStore } from "~~/stores/settingStore"

// const email = ref("")
const settingStore = useSettingStore()
</script>

<style scoped lang="sass">
.footer-column
  display: flex
  flex-direction: column
  & a
    color: black
    font-weight: 400
    font-size: 0.75rem !important
  & a + a
    margin-top: 8px
.footer
  padding: 4rem
  margin-top: 4rem
  @include mobile
    margin-top: 2rem
    padding: 1rem
</style>
