<template>
  <div class="section">
    <h1 class="title is-3">{{ question?.questionStatement }}</h1>
    <RichText :rich-text="question?.description"></RichText>

    <!-- all possible inputs -->
    <div class="my-1_5">
      <ResponseInputOpen
        v-if="question.type === QuestionType.OPEN"
        v-model="answer"
        :color="props.color"
        :question-id="questionId"
      />
      <ResponseInputUniqueChoice
        v-else-if="question.type === QuestionType.UNIQUE_CHOICE"
        v-model="answer"
        :response-choices="question.responseChoices"
        :color="props.color"
        :question-id="questionId"
      />
      <ResponseInputMultipleChoice
        v-else-if="question.type === QuestionType.MULTIPLE_CHOICE"
        v-model="answer"
        :response-choices="question.responseChoices"
        :color="props.color"
        :question-id="questionId"
      />
    </div>

    <!-- end inputs -->

    <!-- TODO add links -->
    <div class="button-bar my-1_5">
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

    <div :class="`menu is-${color}`">
      <div class="tabs">
        <ul>
          <li v-for="tab of tabs" :key="tab.id">
            <a
              class="tab"
              :class="{ 'is-active': tab.id === currentTabId }"
              @click="setTab(tab.id)"
              >{{ tab.label }}</a
            >
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { QuestionType, Question, Definition } from "~/composables/types"
import { useDefinitionStore } from "~/stores/definitionStore"

const definitionStore = useDefinitionStore()

type tabDef = { label: string; id: string }

const props = defineProps({
  questionId: { type: Number, required: true },
  color: { type: String, required: true },
})

const answer = ref()

const question = ref<Question>(null)
const { data, error } = await useApiGet<Question>(
  `questionnaire-questions/${props.questionId}/`
)
if (!error.value) {
  question.value = data.value
}

const definitions = ref<{ [key: number]: Definition }>(
  definitionStore.definitionsByIdArray(question.value.definitionIds)
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

.tabs .tab
  color: var(--color)
  border-bottom-color: currentColor
  &.is-active
    color: var(--color-dark)
  &:hover
    color: var(--color-active)
</style>
