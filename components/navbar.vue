<template>
    <div class="container">
        <nav class="navbar" role="navigation" aria-label="main navigation">
            <div class="navbar-brand">
                <NuxtLink class="navbar-item" to="/">
                    <img src="~/assets/img/logo.svg" width="40" height="40" />
                    <p class="has-text-weight-bold">Titre du projet</p>
                </NuxtLink>
                <a
                    role="button"
                    class="navbar-burger"
                    aria-label="menu"
                    aria-expanded="false"
                    data-target="navbarBasicExample"
                    :class="isBurgerOpen ? 'is-active' : ''"
                    @click="isBurgerOpen = !isBurgerOpen"
                >
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </a>
            </div>

            <div
                id="navbarBasicExample"
                class="navbar-menu"
                :class="isBurgerOpen ? 'is-active' : ''"
            >
                <div class="navbar-start">
                    <NuxtLink
                        v-for="item of navItems"
                        :to="item.to"
                        :class="isRouteActive(item.to) ? 'is-active' : ''"
                        class="navbar-item"
                    >{{ item.name }}</NuxtLink>
                </div>

                <div class="navbar-end">
                    <div class="navbar-item">
                        <div class="buttons">
                            <NuxtLink
                                to="/evaluation"
                                class="button is-dark is-rounded"
                            >Lancer l'évaluation</NuxtLink>
                            <NuxtLink
                                v-if="userStore.isLoggedIn"
                                to="/profil"
                                class="button is-dark is-outlined is-rounded"
                            >{{ userStore.email }}</NuxtLink>
                            <NuxtLink
                                v-else
                                to="/login"
                                class="button is-dark is-outlined is-rounded"
                            >Se connecter</NuxtLink>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/userStore'

const userStore = useUserStore()
// TODO : use router to highlight active route
const route = useRoute()
const isBurgerOpen = ref(false)

const isRouteActive = computed(() => (path) => {
    return route.path === path
})

const navItems = [
    {
        name: "Le référentiel",
        to: "/pilliers",
    },
    {
        name: "Options d'évaluation",
        to: "/options-evaluation",
    },
    {
        name: "Résultats",
        to: "/referentiel",
    },
    {
        name: "Le projet",
        to: "/projet",
    },
]
</script>