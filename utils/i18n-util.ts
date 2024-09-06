import { createI18n } from "vue-i18n"
import en from "~/language/en/en.json"

export const i18n = createI18n({
  legacy: false,
  locale: "en",
  messages: {
    en: en,
  },
})
