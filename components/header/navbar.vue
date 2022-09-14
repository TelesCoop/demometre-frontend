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
                v-if="!isEvaluationRoute"
                :to="userStep.url"
                class="button evaluation is-rounded has-border-cooperation has-text-cooperation-dark"
                >{{ userStep.text }}</NuxtLink
              >
              <button
                v-if="isEvaluationRoute && userStore.isUnknownUser"
                class="button save is-rounded is-shade-600 is-outlined"
                @click="participationStore.setShowSaveParticipationModal(true)"
              >
                Enregistrer
              </button>
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
    <div
      v-if="isQuestionnaireRoute"
      class="is-flex navbar-progress-bar-wrapper"
      :class="{ 'is-unknown-user': userStore.isUnknownUser }"
    >
      <QuestionnaireProgressBars class="navbar-progress-bar" :header="true" />
      <div v-if="userStore.isUnknownUser" class="navbar-progress-bar-save">
        <button
          class="column button is-shade-200 navbar-progress-bar-save-button"
          @click="participationStore.setShowCancelParticipationModal(true)"
        >
          <span>Réinitialiser</span>
          <span class="icon">
            <icon size="15" name="restart" />
          </span>
        </button>
      </div>
    </div>
    <HeaderLine v-else :active-pillar-name="activePillar" />
  </header>
</template>

<script setup lang="ts">
import { useUserStore } from "~/stores/userStore"
import { useParticipationStore } from "~/stores/participationStore"

const emit = defineEmits<{
  (e: "change-header-height", value: number): void
}>()

const userStore = useUserStore()
const userStep = useUserStep()
const participationStore = useParticipationStore()
const route = useRoute()
const isBurgerOpen = ref(false)

const isRouteActive = computed(() => (path) => {
  return route.path === path
})

const isEvaluationRoute = computed(() => {
  return route.path.includes("evaluation")
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
    name: "Utilisations possibles",
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
.button.save
  background: white
  &:hover
    background: $shade-600
    border-color: white
  &:focus
    background: $shade-600
    border-color: white

.navbar-progress-bar-wrapper
  $navbar-progress-bar-save-button-width: 180px
  width: 100%
  &.is-unknown-user
    .navbar-progress-bar
      width: calc(100% - #{$navbar-progress-bar-save-button-width})

  .navbar-progress-bar
    width: 100%
  .navbar-progress-bar-save
    display: flex
    flex-direction: column

  .navbar-progress-bar-save-button
    flex-grow: 1
    width: $navbar-progress-bar-save-button-width

.button .icon
  vertical-align: middle

@include until-widescreen
  .navbar-progress-bar-wrapper
    $navbar-progress-bar-save-button-width: 50px
    &.is-unknown-user
      .navbar-progress-bar
        width: calc(100% - #{$navbar-progress-bar-save-button-width})
    .navbar-progress-bar-save-button
      width: $navbar-progress-bar-save-button-width
      .icon
        display: flex
        align-items: center
        justify-content: center
        margin-left: 0
      span:not(.icon)
        display: none

@include widescreen
  .navbar
    padding: 0 35px

@include fullhd
  .navbar
    padding: 0 70px
</style>
