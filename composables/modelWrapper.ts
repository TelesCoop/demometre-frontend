import { computed, getCurrentInstance } from "vue"

export const useModel = (props, propName) => {
  const vm = getCurrentInstance().proxy

  return computed({
    get() {
      return props[propName]
    },
    set(value) {
      vm.$emit(`update:${propName}`, value)
    },
  })
}
