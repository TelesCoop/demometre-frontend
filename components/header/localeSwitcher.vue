<template>
  <button
    class="button is-rounded is-size-7"
    @click="toggleLocale"
  >
    {{ buttonText }}
  </button>
</template>

<script setup lang="ts">
const localeFromCookie = computed(() => {
  let cookie: string
  if (process.client) {
    cookie = document.cookie
  } else {
    cookie = useRequestHeaders(["cookie"])["cookie"] || ""
  }
  cookie = cookie.split("; ")
    .find((row) => row.startsWith("django_language="))
  const locale = cookie ? cookie.split("=")[1] : "fr"
  return locale
})
const toggleLocale = async () => {
  const locale = localeFromCookie.value === "fr" ? "en" : "fr"
  // set locale using cookies
  await useApiGet(`set-locale/${locale}/`)
  // refresh page
  window.location.reload()
}
const buttonText = computed(() => {
  return localeFromCookie.value === "fr" ? "read in english 🇬🇧" : "lire en français 🇫🇷"
})
</script>
