<template>
  <div class="container is-tight">
    <div class="section">
      <h1 class="title is-3">{{ question?.questionStatement }}</h1>
      <div>{{ question?.description }}</div>
      <QuestionInputOpen
        v-if="question.type === QuestionType.OPEN"
        class="question my-5"
        :color="color"
      />
      <!--      TODO add links-->
      <div class="button-bar my-5">
        <a href="" class="button is-dark is-outlined is-rounded">
          <span>Passer</span>
          <i class="icon">
            <Icon size="16" name="arrow-right-line" />
          </i>
        </a>
        <div class="is-flex buttons rounds">
          <a href="" class="button is-dark is-outlined is-rounded">
            <i class="icon">
              <Icon size="16" name="chat-4" />
            </i>
          </a>
          <a href="" class="button is-dark is-outlined is-rounded">
            <i class="icon">
              <Icon size="16" name="bar-chart-box" />
            </i>
          </a>
          <a href="" class="button is-dark is-outlined is-rounded">
            <i class="icon">
              <Icon size="16" name="question-mark" />
            </i>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PillarName, QuestionType, Question } from "~/composables/types"
import { useApiGet } from "~/composables/api"

type tabDef = { label: string; id: string }

const question = ref<Question>(null)
const { data, error } = await useApiGet<Question>("questionnaire-questions/1/")
if (!error.value) {
  question.value = data.value
}

const pillarName = ref<string>(PillarName.COOPERATION)
const color = computed<string>(() =>
  pillarName.value ? PillarParams[pillarName.value].color : ""
)

const currentTabId = ref<string>("definitions")
const tabs = ref<tabDef[]>([
  {
    label: "Définitions",
    id: "definitions",
  },
  {
    label: "Cadre légal",
    id: "legal",
  },
  {
    label: "Cas d'usage",
    id: "use",
  },
  {
    label: "Ressources",
    id: "ressources",
  },
])

function setTab(tabId) {
  currentTabId.value = tabId
}
</script>

<style scoped lang="sass">
.button-bar
  display: flex
  justify-content: space-between
  .buttons.rounds .button
    height: 40px
    width: 40px
</style>
