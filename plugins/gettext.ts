import { createGettext } from "vue3-gettext"
import translations from "../language/translations.json"
import { useLocale } from "~/composables/useLocale"

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("app:created", async () => {
    const gettext = createGettext({
      availableLanguages: {
        en: "English",
        fr: "Français",
      },
      defaultLanguage: useLocale(),
      translations: translations,
    })

    nuxtApp.vueApp.use(gettext)
  })
})
