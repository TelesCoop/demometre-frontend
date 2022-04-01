import { computed } from "vue"

export const useUniqueId = () => {
  return computed(() => {
    return Math.random().toString(36).slice(2)
  })
}
