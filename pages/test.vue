<template>
  <div>
    <circle-check v-model="val" :items="items"></circle-check>
    <div style="width: 600px">
      <Bar
        :chart-options="chartOptions"
        :chart-data="chartData"
        :chart-id="chartId"
        :dataset-id-key="datasetIdKey"
        :css-classes="cssClasses"
        :styles="styles"
        :width="width"
        :height="height"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js"
import { Bar } from "vue-chartjs"
import { COLORS } from "assets/utils/colors"
import { ref } from "@vue/reactivity"
import CircleCheck from "~/components/circle-checkbox.vue"
import { computed } from "vue"

const categories = {
  habitants: {
    label: "Habitants",
    value: "habitants",
    color: COLORS.success.main,
  },
  services: {
    label: "Services",
    value: "services",
    color: COLORS.success.hover,
  },
  elus: { label: "Élus", value: "elus", color: COLORS.success.active },
  journalistes: {
    label: "Journalistes",
    value: "journalistes",
    color: COLORS.success.dark,
  },
}
const items = Object.values(categories)
const categoryKeys = Object.keys(categories)
const val = ref([...categoryKeys])
ChartJS.register(Title, Tooltip, BarElement, CategoryScale, LinearScale)

const colors = Object.values(COLORS.success)

const data = [
  {
    data: [40, 20, 12, 4, 5],
    category: "habitants",
  },
  {
    data: [23, 24, 13, 38, 22],
    category: "services",
  },
  {
    data: [40, 20, 12, 4, 5],
    category: "elus",
  },
  {
    data: [40, 20, 12, 4, 5],
    category: "journalistes",
  },
]

const labels = ["Je ne sais pas", "Non", "Insuffisamment", "Plutôt", "Oui"]

const buildDataset = (data) => {
  return {
    ...data,
    barThickness: 10,
    backgroundColor: categories[data.category].color,
  }
}
const chartData = computed(() => {
  return {
    labels: labels,
    datasets: data
      .filter((item) => val.value.includes(item.category))
      .map(buildDataset),
  }
})

const chartId = "bar-chart"
const datasetIdKey = "label"
const width = 400
const height = 200

const chartOptions = {
  responsive: true,
  indexAxis: "y",
  scales: {
    x: {
      min: 0,
      max: 100,
      grid: {
        drawBorder: false,
        color: COLORS.success.main,

        borderDash: [6, 4],
      },
      ticks: {
        // Empeche la rotation du texte
        autoSkip: false,
        maxRotation: 0,
        minRotation: 0,
        // Fin empeche la rotation du texte

        font: {
          size: 18,
        },
        beginAtZero: true,
        stepSize: 10,
        color: COLORS.success.main,
        callback(value, index, ticks) {
          if (value % 50 === 0) {
            return `${value}%`
          } else {
            return " "
          }
        },
      },
    },
    y: {
      grid: {
        display: false,
        drawBorder: false,
      },
    },
  },
}
const cssClasses = ""
const styles = {}
</script>

<style scoped lang="sass"></style>
