import { useLoadingStore } from "~/stores/loadingStore"
import { useFetch, useRequestHeaders } from "#app"

let base_url = "/"
let media_base_url
type MyHeaders = { [key: string]: string }

// local
if (process.env.NODE_ENV !== "production") {
  base_url = "http://localhost:8000"
  media_base_url = "http://localhost:8000"
} else {
  // production server
  media_base_url = "http://democratieouverte.tlscp.fr"
  if (process.server) {
    // server-side rendering
    base_url = "http://localhost:8064"
  } else {
    base_url = "http://democratieouverte.tlscp.fr"
  }
}

const makeLoadingKey = (path: string) => {
  // camel-case the path : auth/login -> authLogin
  if (path.endsWith("/")) {
    path = path.slice(0, -1)
  }
  if (path.startsWith("/")) {
    path = path.slice(1)
  }
  let words = path.split("/")
  words = words.filter((word) => !/^\d+$/.test(word))
  for (const [ix, word] of Object.entries(words.slice(1))) {
    const newWord = word[0].toUpperCase() + word.slice(1)
    words[parseInt(ix) + 1] = newWord
  }
  return words.join("")
}

function getCookie() {
  let cookie = useRequestHeaders(["cookie"])["cookie"] || ""
  if (!cookie && process.client) {
    cookie = document.cookie
  }
  return cookie
}

function getCsrfCookie(cookie) {
  if (!cookie) {
    return null
  }
  const csfrRow = cookie.split("; ").find((row) => row.startsWith("csrftoken="))
  if (!csfrRow) {
    return null
  }
  return csfrRow.split("=")[1]
}

function getHeaders(withCsrfCookie = false): MyHeaders {
  const cookie = getCookie()
  const headers: MyHeaders = { cookie: cookie }
  if (withCsrfCookie) {
    const csfrToken = getCsrfCookie(cookie)
    if (csfrToken) {
      headers["X-CSRFTOKEN"] = csfrToken
    }
  }
  return headers
}

export const MADIA_BASE_URL = media_base_url
export const BASE_URL = base_url
export const BASE_API_URL = BASE_URL + "/api/"

export async function useGet<Type>(path: string, opts: any = {}) {
  const options = {
    method: "GET",
    credentials: "include",
    ...opts,
    // avoid crash
    header: opts.headers || useRequestHeaders(["cookie"]),
  }
  return await $fetch<Type>(`${BASE_API_URL}${path}`, options)
}

export async function useApiGet<Type>(path: string) {
  const loadingStore = useLoadingStore()
  const key = makeLoadingKey(path)
  loadingStore.markLoading(key)
  const { data, error } = await useFetch<Type>(`${BASE_API_URL}${path}`, {
    method: "GET",
    credentials: "include",
    headers: getHeaders(),
  })
  if (error.value) {
    loadingStore.markError(key)
  } else {
    loadingStore.markDone(key)
  }
  return { data, error }
}

export async function useAPIwithCsrfToken<Type>(
  path: string,
  method: string,
  payload: any = {}
) {
  const loadingStore = useLoadingStore()

  const key = makeLoadingKey(path)
  loadingStore.markLoading(key)
  const { data, error } = await useFetch<Type>(`${BASE_API_URL}${path}`, {
    method,
    body: payload,
    credentials: "include",
    headers: getHeaders(true),
  })
  if (error.value) {
    loadingStore.markError(key)
  } else {
    loadingStore.markDone(key)
  }
  return { data, error }
}
export async function useApiPost<Type>(path: string, payload: any = {}) {
  return useAPIwithCsrfToken(path, "POST", payload)
}

export async function useApiPatch<Type>(path: string, payload: any = {}) {
  return useAPIwithCsrfToken(path, "PATCH", payload)
}
