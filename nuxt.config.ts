import { defineNuxtConfig } from "nuxt/config"

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  css: ["@/css/app.sass"],
  modules: ["@pinia/nuxt", "@nuxtjs/plausible", "@nuxtjs/i18n"],

  vite: {
    css: {
      preprocessorOptions: {
        sass: {
          additionalData: `@import "@/css/tools.sass" \n`,
          quietDeps: true,
          silenceDeprecations: ["color-functions", "global-builtin", "import"],
          api: "modern-compiler",
        },
      },
    },
  },

  runtimeConfig: {
    backendPort: process.env.NUXT_BACKEND_PORT || process.env.VITE_BACKEND_PORT,
  },

  ssr: true,

  i18n: {
    locales: ["fr", "en"],
    defaultLocale: "fr",
    strategy: "no_prefix",
    silentTranslationWarn: true,
  },

  compatibilityDate: "2024-10-17",
})
