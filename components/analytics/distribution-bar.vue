<template>
  <div class="distribution-chart">
    <div
      v-for="(item, index) in items"
      :key="index"
      class="distribution-chart-item"
      :style="`width: ${item.displayValue}%;`"
      @mouseenter="onMouseEnter(item)"
      @mouseleave="onMouseLeave()"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { round } from "~/utils/round"

const props = defineProps({
  data: { type: Array, required: true },
  digits: {
    type: Number,
    default: 2,
  },
})

const emit = defineEmits<{
  (e: "mouseenter-item", value: any): void
  (e: "mouseleave-item"): void
}>()

const total = ref<number>(getTotal(props.data))
const items = ref(getItemValues(props.data))

watch(
  () => props.data,
  (newData) => {
    total.value = getTotal(newData)
    items.value = getItemValues(newData)
  }
)

function getTotal(data) {
  return data.reduce((value, item) => value + item.value, 0)
}
function getItemValues(data) {
  return props.data.map((item) => {
    return {
      ...item,
      displayValue: round((item.value / total.value) * 100, 2),
    }
  })
}

function onMouseEnter(item) {
  emit("mouseenter-item", item)
}

function onMouseLeave() {
  emit("mouseleave-item")
}
</script>

<style scoped lang="sass">
.distribution-chart
  display: flex
  height: 12px
  max-height: 12px
  width: 100%
  border: 1px solid $shade-600
  border-radius: 20px
  cursor: pointer

  &-item
    height: 100%

    &:not(:last-child)
      border-right: 1px solid $shade-600

    &:hover
      background-color: $shade-400
</style>
