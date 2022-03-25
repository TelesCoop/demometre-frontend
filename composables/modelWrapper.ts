import { computed, getCurrentInstance } from "vue"

export const useModel = (propName) => {
  const vm = getCurrentInstance().proxy

  return computed({
    get() {
      return vm.$props[propName]
    },
    set(value) {
      vm.$emit(`update:${propName}`, value)
    },
  })
}
