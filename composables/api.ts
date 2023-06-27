import { useLoadingStore } from "~/stores/loadingStore"

let media_base_url
type MyHeaders = { [key: string]: string }

// local

const useApiUrl = () => {
  let apiUrl = ""
  if (process.env.NODE_ENV !== "production") {
    apiUrl = "http://localhost:8000"
  } else {
    // production server
    if (process.server) {
      const config = useRuntimeConfig()

      // server-side rendering
      apiUrl = `http://127.0.0.1:${config.backendPort}`
      console.log("### API backend port", config.backendPort)
    }
  }

  return `${apiUrl}/api/`
}

const makeLoadingKey = (path: string) => {
  // camel-case the path : auth/login -> authLogin
  if (path.endsWith("/")) {
    path = path.slice(0, -1)
  }
  if (path.startsWith("/")) {
    path = path.slice(1)
  }
  return path.replace(/\//g, "-")
}

function getCookie() {
  let cookie: string
  if (process.server) {
    cookie = useRequestHeaders(["cookie"])["cookie"] || ""
  } else {
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

if (process.env.NODE_ENV !== "production") {
  media_base_url = "http://localhost:8000"
} else {
  // production server
  media_base_url = ""
}
export const MEDIA_BASE_URL = media_base_url

export async function useApiGet<Type>(path: string) {
  const loadingStore = useLoadingStore()
  const key = makeLoadingKey(path)
  loadingStore.markLoading(key)
  const { data, error } = await useFetch<Type>(`${useApiUrl()}${path}`, {
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
  const { data, error } = await useFetch<Type>(`${useApiUrl()}${path}`, {
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
