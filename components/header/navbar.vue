<template>
  <div>
    <nav
      class="navbar has-background-shade-600"
      role="navigation"
      aria-label="main navigation"
    >
      <div class="navbar-brand">
        <NuxtLink class="navbar-item" to="/">
          <HeaderLogo :active-pillar-name="activePillar" />
        </NuxtLink>
        <a
          role="button"
          class="navbar-burger has-background-shade-600"
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarMenu"
          :class="isBurgerOpen ? 'is-active' : ''"
          @click="isBurgerOpen = !isBurgerOpen"
        >
          <span aria-hidden="true" class="has-text-white"></span>
          <span aria-hidden="true" class="has-text-white"></span>
          <span aria-hidden="true" class="has-text-white"></span>
        </a>
      </div>

      <div
        id="navbarMenu"
        class="navbar-menu"
        :class="isBurgerOpen ? 'is-active has-background-shade-600' : ''"
      >
        <div
          class="navbar-start px-1"
          :class="
            isBurgerOpen ? '' : 'has-background-white inline-navbar-start'
          "
        >
          <NuxtLink
            v-for="(item, index) of navItems"
            :key="index"
            :to="item.to"
            :class="
              isRouteActive(item.to)
                ? 'is-active has-text-shade-600'
                : 'has-text-shade-400'
            "
            class="navbar-item"
            >{{ item.name }}</NuxtLink
          >
        </div>

        <div class="navbar-end">
          <div class="navbar-item">
            <div class="buttons">
              <NuxtLink
                to="/evaluation"
                class="button is-rounded has-border-cooperation has-text-cooperation-dark"
                >Lancer l'évaluation</NuxtLink
              >
              <NuxtLink
                v-if="userStore.isLoggedIn"
                to="/profil"
                class="button is-white is-outlined is-rounded"
                >{{ userStore.user.email }}</NuxtLink
              >
              <NuxtLink
                v-else
                to="/login"
                class="button is-white is-outlined is-rounded"
                >Se connecter</NuxtLink
              >
            </div>
          </div>
        </div>
      </div>
    </nav>
    <HeaderLine :active-pillar-name="activePillar" />
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "~/stores/userStore"

const userStore = useUserStore()
// TODO : use router to highlight active route
const route = useRoute()
const isBurgerOpen = ref(false)

const isRouteActive = computed(() => (path) => {
  return route.path === path
})

const activePillar = computed(() => {
  return route.query.pillar || ""
})

const navItems = [
  {
    name: "Accueil",
    to: "/",
  },
  {
    name: "DémoMètre",
    to: "/demometre",
  },
  {
    name: "Utilisations possible",
    to: "/utilisation-possible",
  },
  {
    name: "Résultats",
    to: "/resultats",
  },
  {
    name: "Le projet",
    to: "/projet",
  },
]
</script>

<style scoped lang="sass">
.inline-navbar-start
  border-radius: 1000px
  margin: 14px 24px
@include widescreen
  .navbar
    padding: 0 35px
@include fullhd
  .navbar
    padding: 0 70px
</style>
