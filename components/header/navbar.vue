<template>
  <header class="header-fixed" fixed="top">
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
                :to="userStep.url"
                class="button evaluation is-rounded has-border-cooperation has-text-cooperation-dark"
                >{{ userStep.text }}</NuxtLink
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
    <QuestionnaireProgressBars v-if="isQuestionnaireRoute" :header="true" />
    <HeaderLine v-else :active-pillar-name="activePillar" />
  </header>
</template>

<script setup lang="ts">
import { useUserStore } from "~/stores/userStore"

const emit = defineEmits<{
  (e: "change-header-height", value: number): void
}>()

const userStore = useUserStore()
const userStep = useUserStep()
// TODO : use router to highlight active route
const route = useRoute()
const isBurgerOpen = ref(false)

const isRouteActive = computed(() => (path) => {
  return route.path === path
})

const isQuestionnaireRoute = computed(() => {
  const isQuestionnaireRoute = route.path.includes("evaluation/questionnaire")
  emit("change-header-height", isQuestionnaireRoute ? 125 : 75)
  return isQuestionnaireRoute
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
    to: "/utilisations-possibles",
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
.header-fixed
  left: 0
  position: fixed
  right: 0
  top: 0
  z-index: 30
.inline-navbar-start
  border-radius: 1000px
  margin: 14px 24px
.button.evaluation:hover
  background: $cooperation
@include widescreen
  .navbar
    padding: 0 35px
@include fullhd
  .navbar
    padding: 0 70px
</style>
