<template>
  <form v-if="question" class="section" @submit="submit">
    <section class="pb-2">
      <h1 class="title is-3">{{ question.questionStatement }}</h1>
      <RichText :rich-text="question.description"></RichText>

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
        <ResponseInputBinary
          v-else-if="question.type === QuestionType.BOOLEAN"
          v-model="answer"
          :color="props.color"
          :question-id="questionId"
        />
        <ResponseInputRanking
          v-else-if="question.type === QuestionType.CLOSED_WITH_RANKING"
          v-model="answer"
          :response-choices="question.responseChoices"
          :color="props.color"
        />
        <ResponseInputScale
          v-else-if="question.type === QuestionType.CLOSED_WITH_SCALE"
          v-model="answer"
          :categories="question.categories"
          :color="props.color"
          :response-choices="question.responseChoices"
        />
      </div>

      <!-- end inputs -->

      <!-- TODO add links -->
      <div class="button-bar my-1_5">
        <template v-if="isAnswered">
          <div class="is-flex is-align-items-center">
            <button
              class="button is-dark is-outlined is-rounded mr-0_75"
              @click="submit"
            >
              <span>Valider</span>
              <i class="icon">
                <Icon size="16" name="check" />
              </i>
            </button>
            <span class="is-size-7">
              appuyez sur
              <span class="has-text-weight-bold">Entrer ⮐</span></span
            >
          </div>
        </template>
        <template v-else>
          <button
            class="button is-dark is-outlined is-rounded"
            @click="goToNextQuestion"
          >
            <span>Passer</span>
            <i class="icon">
              <Icon size="16" name="arrow-right-line" />
            </i>
          </button>
        </template>
        <a
          v-if="tabs.length"
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
    <section
      v-if="tabs.length"
      id="menu"
      class="pt-2"
      :class="`menu is-${color}`"
    >
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
        <div
          v-for="definition of definitions"
          :key="definition.id"
          class="mt-2"
        >
          <span class="has-text-weight-bold">{{ definition.word }}</span>
          <RichText
            class="mt-1 is-block is-family-secondary"
            :rich-text="definition.explanation"
          />
        </div>
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
  </form>
  <div v-else style="text-align: center">
    <Loader :color="props.color" />
  </div>
</template>

<script setup lang="ts">
import {
  QuestionType,
  Question,
  Definition,
  QuestionBounds,
} from "~/composables/types"
import { useDefinitionStore } from "~/stores/definitionStore"
import { useProfilingStore } from "~/stores/profilingStore"
import { useQuestionnaireStore } from "~/stores/questionnaireStore"
import { useParticipationStore } from "~/stores/participationStore"
import { computed } from "vue"
import {
  useProfilingJourney,
  useQuestionnaireJourney,
} from "~/composables/journey"

const definitionStore = useDefinitionStore()
const questionnaireStore = useQuestionnaireStore()
const profilingStore = useProfilingStore()
const participationStore = useParticipationStore()

type tabDef = { label: string; id: string }

const props = defineProps({
  questionId: { type: Number, required: true },
  context: { type: String, default: "questionnaire" },
  color: { type: String, required: true },
})

const journey = computed(() => {
  return props.context === "questionnaire"
    ? useQuestionnaireJourney()
    : useProfilingJourney()
})

const answer = ref()
const isAnswered = computed(() => {
  if (Array.isArray(answer.value)) return !!answer.value.length
  return !!answer.value
})

const question = computed(() => {
  if (props.context === "questionnaire") {
    return questionnaireStore.questionById[props.questionId]
  } else if (props.context === "profiling") {
    return profilingStore.questionById[props.questionId]
  } else {
    console.error("Unkown question type")
    return null
  }
})

const definitions = computed<{ [key: number]: Definition }>(() =>
  definitionStore.definitionsByIdArray(question.value.definitionIds)
)

// Attention ce n'est pas reload si on change de question
const currentTabId = ref<string>("definitions")
const tabs = ref<tabDef[]>([])
if (question.value?.definitionIds) {
  tabs.value.push({
    label: "Définitions",
    id: "definitions",
  })
}
if (question.value?.legalFrame) {
  tabs.value.push({
    label: "Cadre légal",
    id: "legal-frame",
  })
}
if (question.value?.useCase) {
  tabs.value.push({
    label: "Exemples inspirants",
    id: "use-case",
  })
}
if (question.value?.sources) {
  tabs.value.push({
    label: "Sources",
    id: "sources",
  })
}
if (question.value?.toGoFurther) {
  tabs.value.push({
    label: "Pour aller plus loin",
    id: "to-go-further",
  })
}

function setTab(tabId) {
  currentTabId.value = tabId
}

const goToNextQuestion = () => {
  useRouter().push(
    `/evaluation/${
      participationStore.id
    }/affinage/${journey.value.nextQuestionId(props.questionId)}`
  )
}

const submit = () => {
  participationStore.saveResponse(props.questionId, answer).then((result) => {
    if (result) {
      goToNextQuestion()
    }
  })
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
