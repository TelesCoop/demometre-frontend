<template>
  <div>
    <div style="width: 600px">
      <ResponseAnalyticsHorizontalBarChart
        chart="chart1"
        :height="200"
        :widht="400"
        :categories="categoriesValue"
        :data="data"
        :labels="labels"
      ></ResponseAnalyticsHorizontalBarChart>
    </div>
  </div>
</template>

<script setup lang="ts">
import { COLORS } from "assets/utils/colors"

const categories = {
  habitants: {
    label: "Habitants",
    value: "habitants",
    class: "is-success-main",
  },
  services: {
    label: "Services",
    value: "services",
    class: "is-success-hover",
  },
  elus: {
    label: "Élus",
    value: "elus",
    class: "is-success-active",
  },
  journalistes: {
    label: "Journalistes",
    value: "journalistes",
    class: "is-success-dark",
  },
}
const categoriesValue = Object.values(categories)

const data = [
  {
    data: [40, 20, 12, 4, 5],
    category: "habitants",
    backgroundColor: COLORS.success.main,
  },
  {
    data: [23, 24, 13, 38, 22],
    category: "services",
    backgroundColor: COLORS.success.hover,
  },
  {
    data: [40, 20, 12, 4, 5],
    category: "elus",
    backgroundColor: COLORS.success.active,
  },
  {
    data: [40, 20, 12, 4, 5],
    category: "journalistes",
    backgroundColor: COLORS.success.dark,
  },
]

const labels = ["Je ne sais pas", "Non", "Insuffisamment", "Plutôt", "Oui"]
</script>

<style scoped lang="sass"></style>
