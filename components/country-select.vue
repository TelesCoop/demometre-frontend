<template>
  <select>
    <slot></slot>
    <option
      v-for="country in COUNTRIES"
      :key="country.code"
      :value="country.code"
    >
      {{ country.name }}
    </option>
  </select>
</template>

<script setup lang="ts">
import { COUNTRIES } from "assets/utils/countries"
</script>
