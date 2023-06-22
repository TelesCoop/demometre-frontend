import { defineNuxtConfig } from "nuxt/config"

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  css: ["@/css/app.sass"],
  modules: ["@pinia/nuxt"],
  vite: {
    css: {
      preprocessorOptions: {
        sass: {
          additionalData: `@import "@/css/tools.sass" \n`,
        },
      },
    },
  },
  // head: {},
})
