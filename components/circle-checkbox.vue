<template>
  <div class="circle-checkbox">
    <span
      v-for="item of items"
      :key="getId(uniqueId, item.value)"
      class="mr-1_5"
    >
      <input
        :id="getId(uniqueId, item.value)"
        v-model="answer"
        type="checkbox"
        :value="item.value"
        class="circle-checkbox-input mr-0_75"
      />
      <label class="circle-checkbox" :for="getId(uniqueId, item.value)">{{
        item.label
      }}</label>
    </span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  items: { type: Array, required: true },
  modelValue: { type: Array, required: true },
})

const uniqueId = useUniqueId()
const getId = (id, value) => `${id}-${value}`
const answer = useModel("modelValue")
</script>

<style scoped lang="sass">
.circle-checkbox
  .circle-checkbox-input
    border-radius: 50%
    background-color: transparent
    border-width: 1px
    border-style: solid
    border-color: #2A3E56
</style>
