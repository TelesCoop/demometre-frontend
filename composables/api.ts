import { NuxtApp } from "nuxt3/dist/app/nuxt"
import { useLoadingStore } from "~/stores/loadingStore"
import { User } from "./types"

let base_url = ""
type MyHeaders = { [key: string]: string }

// local
if (process.env.NODE_ENV !== "production") {
    base_url = "http://localhost:8000"
} else {
    // production server
    if (process.server) {
        // server-side rendering
        base_url = "http://localhost:8000"
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
    words = words.filter(word => !(/^\d+$/.test(word)))
    for (const [ix, word] of Object.entries(words.slice(1))) {
        const newWord = word[0].toUpperCase() + word.slice(1)
        words[parseInt(ix) + 1] = newWord
    }
    return words.join("")
}

const getCsrfCookie = (ctx: NuxtApp) => {
    let cookie: string = ""
    if (ctx?.ssrContext?.req.headers.cookie) {
        cookie = ctx?.ssrContext.req.headers.cookie
    } else if (process.client) {
        cookie = document.cookie
    }
    if (!cookie) {
        return null
    }
    const csfrRow = cookie.split('; ').find(row => row.startsWith('csrftoken='))
    if (!csfrRow) {
        return null
    }
    return csfrRow.split('=')[1]
}

const getHeaders = (ctx: NuxtApp, includeCsrf = false): MyHeaders => {
    const headers: MyHeaders = useRequestHeaders(['cookie'])
    if (includeCsrf) {
        const csfrToken = getCsrfCookie(ctx)
        if (csfrToken) {
            headers["X-CSRFTOKEN"] = csfrToken
        }
    }
    return headers
}


export const BASE_URL = base_url;

export async function useApiGet<Type>(path: string) {
    const loadingStore = useLoadingStore()

    const key = makeLoadingKey(path)
    loadingStore.markLoading(key)
    const { data, error } = await useAsyncData<Type>(
        key,
        (ctx) => $fetch(BASE_URL + "/api/" + path, { method: 'GET', credentials: 'include', headers: getHeaders(ctx) })
    )
    console.log("### apiGet results", key, data.value, error.value);
    if (error.value) {
        loadingStore.markError(key)
    } else {
        loadingStore.markDone(key)
    }
    return { data, error }
}

export async function useApiPost<Type>(path: string, payload: any = {}) {
    const loadingStore = useLoadingStore()

    const key = makeLoadingKey(path)
    loadingStore.markLoading(key)
    const { data, error } = await useAsyncData<Type>(
        key,
        (ctx) => $fetch(BASE_URL + "/api/" + path, { method: 'POST', body: payload, credentials: 'include', headers: getHeaders(ctx, true) })
    )
    console.log("### apiPost results", key, data.value, error.value);
    if (error.value) {
        loadingStore.markError(key)
    } else {
        loadingStore.markDone(key)
    }
    return { data, error }
}
