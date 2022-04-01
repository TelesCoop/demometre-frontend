<template>
  <div class="circle-checkbox">
    <span
      v-for="item of items"
      :key="getId(uniqueId, item.value)"
      class="circle-checkbox-wrapper mr-1_5"
      :class="item.class"
    >
      <input
        :id="getId(uniqueId, item.value)"
        v-model="answer"
        type="checkbox"
        :value="item.value"
        class="circle-checkbox-input"
      />
      <label class="circle-checkbox-label" :for="getId(uniqueId, item.value)">{{
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
  $checkbox-size: 15px
  input[type="checkbox"]
    appearance: none
    position: absolute

    width: $checkbox-size
    height: $checkbox-size
    top: 50%
    transform: translateY(-50%)
    border-radius: 50%
    background-color: transparent
    border-width: 1px
    border-style: solid
    cursor: pointer

    &:checked
      border: none

  .circle-checkbox-label
    padding-left: #{ $checkbox-size + 12px }
    cursor: pointer


  .circle-checkbox-wrapper
    position: relative

    &.is-success-main
      input[type="checkbox"]
        border-color: $success-main
      input[type="checkbox"]
        &:checked
          background-color: $success-main

    &.is-success-hover
      input[type="checkbox"]
        border-color: $success-hover
      input[type="checkbox"]
        &:checked
          background-color: $success-hover

    &.is-success-active
      input[type="checkbox"]
        border-color: $success-active
      input[type="checkbox"]
        &:checked
          background-color: $success-active

    &.is-success-dark
      input[type="checkbox"]
        border-color: $success-dark
      input[type="checkbox"]
        &:checked
          background-color: $success-dark
</style>
