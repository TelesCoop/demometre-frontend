import { defineNuxtConfig } from "nuxt"

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  css: ["@/css/app.sass"],
  buildModules: ["@pinia/nuxt"],
  vite: {
    css: {
      preprocessorOptions: {
        sass: {
          additionalData: `@import "@/css/tools.sass" \n`,
        },
      },
    },
  },
  head: {
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },
})
