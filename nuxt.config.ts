import { defineNuxtConfig } from "nuxt"

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  css: ["@/css/app.sass"],
  buildModules: ["@pinia/nuxt"],
  runtimeConfig: {
    public: {
      ROLLBAR_POST_CLIENT_ITEM_ACCESS_TOKEN:
        process.env.ROLLBAR_POST_CLIENT_ITEM_ACCESS_TOKEN,
    },
  },
  vite: {
    css: {
      preprocessorOptions: {
        sass: {
          additionalData: `@import "@/css/tools.sass" \n`,
        },
      },
    },
  },
  head: {},
})
