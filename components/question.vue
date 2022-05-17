<template>
  <form v-if="question" class="section" @submit.prevent="submit">
    <section class="pb-2">
      <h1 class="title is-3">{{ question.questionStatement }}</h1>
      <RichText :rich-text="question.description"></RichText>

      <!-- Center bloc : question inputs + button previous and next -->
      <div class="change-question-container" style="position: relative">
        <!-- all possible inputs -->
        <div class="my-1_5">
          <ResponseInputOpen
            v-if="question.type === QuestionType.OPEN"
            v-model="answer"
            :color="props.color"
            :question-id="questionId"
          />
          <ResponseInputPercentage
            v-if="question.type === QuestionType.PERCENTAGE"
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
            :max-multiple-choices="
              question.maxMultipleChoices || question.responseChoices.length
            "
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

        <!-- button previous next -->
        <button
          v-if="
            !props.context.journey.isFirstQuestion(question.id) ||
            props.context.hasPreviousStep
          "
          class="button is-dark is-outlined is-rounded change-question-button previous"
          @click.prevent="goToPreviousQuestion"
        >
          <div>
            <i class="icon">
              <Icon size="16" name="arrow-left-line" class="mt-0_5" />
            </i>
          </div>
        </button>
        <button
          class="button is-dark is-outlined is-rounded change-question-button next"
          :disabled="nextQuestionDisabled"
          @click.prevent="goToNextQuestion"
        >
          <div>
            <i class="icon">
              <Icon size="16" name="arrow-right-line" class="mt-0_5" />
            </i>
          </div>
        </button>
      </div>

      <!-- end inputs -->

      <!-- TODO add links -->
      <div class="button-bar my-1_5">
        <div class="is-flex is-align-items-center">
          <button
            v-if="isAnswered || question.mandatory"
            class="button is-dark is-outlined is-rounded mr-0_75"
            :disabled="validationDisabled"
          >
            <span>Valider</span>
            <i class="icon">
              <Icon size="16" name="check" />
            </i>
          </button>
          <button v-else class="button is-dark is-outlined is-rounded mr-0_75">
            <span>Je ne sais pas / Je passe</span>
            <i class="icon">
              <Icon size="16" name="arrow-right-line" />
            </i>
          </button>
          <span class="is-size-7">
            appuyez sur
            <span class="has-text-weight-bold">Entrer ⏎</span></span
          >
        </div>
        <div class="is-flex buttons rounds">
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
  Definition,
  QuestionContextProps,
  SurveyType,
} from "~/composables/types"
import { computed, PropType, watch } from "vue"
import { ref } from "@vue/reactivity"
import { useDefinitionStore } from "~/stores/definitionStore"
import { useParticipationStore } from "~/stores/participationStore"
import { getQuestionResponseValue } from "assets/utils/question-response"
import { useQuestionnaireStore } from "~/stores/questionnaireStore"

type tabDef = { label: string; id: string }
const props = defineProps({
  questionId: { type: Number, required: true },
  context: { type: Object as PropType<QuestionContextProps>, required: true },
  color: { type: String, required: true },
})

const participationStore = useParticipationStore()
const definitionStore = useDefinitionStore()

const isAnswered = computed(() => {
  if (Array.isArray(answer.value)) return !!answer.value.length
  return !!answer.value || answer.value === 0 || answer.value === false
})

const question = computed(() => {
  return props.context.questionById[props.questionId]
})

const initialValue = getQuestionResponseValue(
  props.context.responseByQuestionId[props.questionId],
  question.value.type
)

const answer = ref(initialValue)

watch(question, () => {
  answer.value = getQuestionResponseValue(
    props.context.responseByQuestionId[props.questionId],
    question.value.type
  )
})

const validationDisabled = computed(() => (isAnswered.value ? false : true))

const nextQuestionDisabled = computed(() =>
  initialValue ||
  props.context.responseByQuestionId[props.questionId]?.hasPassed
    ? false
    : true
)

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

const goToPreviousQuestion = () => {
  props.context.journey.goToPreviousQuestion(question.value.id)
}

const goToNextQuestion = () => {
  props.context.journey.goToNextQuestion(question.value.id)
}

const submit = async () => {
  const result = await participationStore.saveResponse(
    question.value,
    answer.value,
    isAnswered.value
  )
  if (result) {
    if (props.context.journey.isLastQuestion(question.value.id)) {
      if (question.value.surveyType === SurveyType.PROFILING) {
        await participationStore.saveEndQuestionnaire(true)
      } else {
        const pillarId: number =
          useQuestionnaireStore().getHierarchicalQuestionStructure({
            question: question.value,
          }).pillarId
        await participationStore.saveEndQuestionnaire(false, pillarId)
      }
      useRouter().push("/evaluation/questionnaire")
    } else {
      props.context.journey.goToNextQuestion(question.value.id)
    }
  }
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

.change-question
  &-container
    position: relative
  &-button
    position: absolute
    top: 50%
    @include widescreen
      &.next
        right: -10rem
      &.previous
        left: -10rem
    @include desktop-only
      &.next
        right: -5rem
      &.previous
        left: -5rem
    @include touch
      &.next
        right: -0.5rem
      &.previous
        left: -0.5rem
</style>
