<template>
  <div class="choice-question-chart">
    <div class="choice-question-chart-grid mb-1">
      <div></div>
      <div class="choice-question-chart-role-choice">
        <p :class="`has-text-${color}-hover`">Personne(s) concernée(s)</p>
        <p :class="`has-text-${color}-dark mt-0_5`">
          Sélectionner ci-dessous un ou plusieurs acteurs
        </p>
        <div class="buttons mt-0_5">
          <button
            v-for="(roleId, index) of question.roleIds"
            :key="roleId"
            class="button is-outlined"
            :class="
              `has-border-${color}-dark ` +
              (isRoleActive(roleId)
                ? `has-background-${rolesGradiants[index][0]} has-text-${rolesGradiants[index][1]}`
                : `has-text-${color}-dark`)
            "
            @click.prevent="onRoleClick(roleId)"
          >
            {{ profilingStore.roleById[roleId].name }}
          </button>
        </div>
      </div>
    </div>
    <div
      class="choice-question-chart-grid mb-1"
      :class="`has-text-${color}-hover`"
    >
      <div>Caractéristique(s)</div>
      <div v-for="(choice, choiceKey) in data.choices" :key="choiceKey">
        {{ choice.label }}
      </div>
    </div>
    <div class="choice-question-chart-grid">
      <template
        v-for="(category, categoryKey) in data.value"
        :key="categoryKey"
      >
        <div
          :class="`has-background-${color}-light`"
          class="choice-question-chart-cell has-text-right"
        >
          {{ category.label }}
        </div>
        <div
          v-for="(choice, key) in category.value"
          :key="key"
          :class="`has-background-${color}-light`"
          class="choice-question-chart-bar-cell"
        >
          <div
            v-for="(roleId, index) of question.roleIds"
            :key="roleId"
            class="choice-question-chart-bar-container"
          >
            <div
              v-if="roleIdsSelected.includes(roleId)"
              class="choice-question-chart-bar"
              :class="`has-background-${rolesGradiants[index][0]} has-border-${color}-dark`"
              :style="`width: ${getPercentage(
                getValueByRoleId(choice, roleId),
                data.count
              )}%`"
            ></div>
          </div>
          <template v-for="index in totalSeparator" :key="index">
            <AnalyticsChoiceQuestionChartLine
              class="choice-question-chart-line"
              :class="`is-${color}`"
              :index="index - 1"
              :color="color"
              :total-line="totalSeparator"
              :full-line-modulo="fullLineModulo"
              :percentage-of-space-already-taken="percentageOfSpaceAlreadyTaken"
              :gap-size="gapSize"
              :percentage-size="percentageSize"
              :left-base-margin="leftBaseMargin"
            ></AnalyticsChoiceQuestionChartLine>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getPercentage } from "assets/utils/percentage"
import { getColorGradients } from "assets/utils/choice-question-chart"
import { useProfilingStore } from "~/stores/profilingStore"

const props = defineProps({
  data: { type: Object, required: true },
  color: { type: String, required: true },
  question: { type: Object, required: true },
})
const profilingStore = useProfilingStore()
const totalSeparator = 11
const fullLineModulo = 5
const percentageOfSpaceAlreadyTaken = 0
const gapSize = 0
const percentageSize = 0
const leftBaseMargin = 0

const rolesGradiants = computed(
  () => getColorGradients(props.color)[props.question.roleIds.length]
)

const roleIdsSelected = ref<number[]>([])
const onRoleClick = (roleId) => {
  if (!roleIdsSelected.value.includes(roleId)) {
    roleIdsSelected.value.push(roleId)
  } else {
    roleIdsSelected.value.splice(roleIdsSelected.value.indexOf(roleId), 1)
  }
}
const isRoleActive = (roleId) => {
  return roleIdsSelected.value.includes(roleId)
}
const getValueByRoleId = (choice, roleId) => {
  const roleName = profilingStore.roleById[roleId].name
  return choice[roleName] ? choice[roleName].value : 0
}
</script>

<style scoped lang="sass">
.choice-question-chart
  &-grid
    display: grid
    grid-template-columns: 135px repeat(auto-fill, 110px)
    grid-gap: 1rem

  &-role-choice
    grid-column: 2/-1

  &-cell
    padding: 6px

  &-bar-container
    z-index: 2

  &-bar
    z-index: 1
    height: 22px
    border: 1px solid black

  &-bar-cell
    display: flex
    flex-direction: column
    justify-content: center
    position: relative

  &-line
    position: absolute
    height: 100%
    border-left-width: 1px
    border-left-style: solid
    border-left-color: var(--color-hover)
    z-index: 0

    &.is-dashed
      border-left-style: dashed
      border-left-color: var(--color)

  &-line-number
    position: absolute
    bottom: 0
    transform: translate(-50%, 100%)
</style>
