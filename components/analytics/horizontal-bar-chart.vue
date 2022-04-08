<template>
  <div>
    <div class="is-flex is-justify-content-center mb-2">
      <CircleCheckbox
        v-model="selectedCategory"
        :items="categories"
      ></CircleCheckbox>
    </div>
    <div>
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
import { computed } from "vue"
import CircleCheckbox from "~/components/circle-checkbox.vue"

ChartJS.register(Title, Tooltip, BarElement, CategoryScale, LinearScale)

const props = defineProps({
  chartId: { type: String, require: true },
  datasetIdKey: { type: String, default: "label" },
  height: { type: Number, require: true },
  width: { type: Number, require: true },
  categories: { type: Array, require: true },
  data: { type: Array, require: true },
  labels: { type: Array, require: true },
})

const selectedCategory = ref([...props.categories.map((item) => item.value)])
watch(props.categories, (categories) => {
  selectedCategory.value = categories.map((item) => item.value)
})

const buildDataset = (data) => {
  return {
    ...data,
    barThickness: 10,
  }
}
const chartData = computed(() => {
  return {
    labels: props.labels,
    datasets: props.data
      .filter((item) => selectedCategory.value.includes(item.category))
      .map(buildDataset),
  }
})

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
        callback(value) {
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
