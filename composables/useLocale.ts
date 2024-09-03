export const useLocale = () => {
  let cookie: string
  if (process.client) {
    cookie = document.cookie
  } else {
    cookie = useRequestHeaders(["cookie"])["cookie"] || ""
  }
  cookie = cookie.split("; ")
    .find((row) => row.startsWith("django_language="))
  console.log("### uselocale", cookie ? cookie.split("=")[1] : "fr")
  return cookie ? cookie.split("=")[1] : "fr"
}
