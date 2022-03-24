<template>
  <div class="section">
    <section class="pb-2">
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
        <template v-if="isAnswered">
          <div class="is-flex is-align-items-center">
            <a href="" class="button is-dark is-outlined is-rounded mr-0_75">
              <span>Valider</span>
              <i class="icon">
                <Icon size="16" name="check-line" />
              </i>
            </a>
            <span class="is-size-7">
              appuyez sur
              <span class="has-text-weight-bold">Entrer ⮐</span></span
            >
          </div>
        </template>
        <template v-else>
          <a href="" class="button is-dark is-outlined is-rounded">
            <span>Passer</span>
            <i class="icon">
              <Icon size="16" name="arrow-right-line" />
            </i>
          </a>
        </template>
        <a
          href="#menu"
          class="button is-dark is-outlined is-rounded round absolute-centered"
        >
          <i class="icon">
            <Icon size="16" name="arrow-down-line" />
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
    </section>
    <section id="menu" class="pt-2" :class="`menu is-${color}`">
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
      <div v-show="currentTabId === 'definitions'">
        <p v-for="definition of definitions" :key="definition.id" class="mt-1">
          <span class="has-text-weight-bold">{{ definition.word }}</span>
          <RichText class="mt-1 is-block" :rich-text="definition.explanation" />
        </p>
      </div>
      <div v-show="currentTabId === 'legal-frame'">
        <RichText :rich-text="question.legalFrame" />
      </div>
      <div v-show="currentTabId === 'use-case'">
        <RichText :rich-text="question.useCase" />
      </div>
      <div v-show="currentTabId === 'sources'">
        <RichText :rich-text="question.sources" />
      </div>
      <div v-show="currentTabId === 'to-go-further'">
        <RichText :rich-text="question.toGoFurther" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { QuestionType, Question, Definition } from "~/composables/types"
import { useDefinitionStore } from "~/stores/definitionStore"
import RichText from "~/components/rich-text.vue"

const definitionStore = useDefinitionStore()

type tabDef = { label: string; id: string }

const props = defineProps({
  questionId: { type: Number, required: true },
  color: { type: String, required: true },
})

const answer = ref()
const isAnswered = computed(() => {
  if (Array.isArray(answer.value)) return !!answer.value.length
  return !!answer.value
})

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
    id: "legal-frame",
  },
  {
    label: "Exemples inspirants",
    id: "use-case",
  },
  {
    label: "Sources",
    id: "sources",
  },
  {
    label: "Pour aller plus loin",
    id: "to-go-further",
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
  position: relative
  .absolute-centered
    position: absolute
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)
.buttons.rounds .button, .button.round
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
