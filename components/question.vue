<template>
  <div v-if="question">
    <section class="section">
      <form
        v-if="question"
        class="questionnaire-container"
        @submit.prevent="submit"
      >
        <h1 class="title is-size-3-tablet is-size-4-mobile">
          {{ question.questionStatement }}
        </h1>
        <RichText
          v-if="question.description"
          class="is-family-secondary p-1 has-background-shade-200"
          :rich-text="question.description"
        ></RichText>

        <!-- Center bloc : question inputs + button previous and next -->
        <div class="nav-questionnaire-container" style="position: relative">
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
            <ResponseInputScale
              v-else-if="question.type === QuestionType.CLOSED_WITH_SCALE"
              v-model="answer"
              :categories="question.categories"
              :color="props.color"
              :response-choices="question.responseChoices"
            />
          </div>

          <!-- button previous next -->
          <QuestionnairePreviousButton
            v-if="
              !props.context.journey.isFirstQuestion(question.id) ||
              props.context.hasPreviousStep
            "
            @go-back="goToPreviousQuestion"
          />
          <button
            class="button is-dark is-outlined is-rounded nav-questionnaire-button next"
            type="button"
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
        <div class="button-bar my-1_5">
          <div class="is-flex is-align-items-center">
            <button
              v-if="isAnswered || question.mandatory"
              class="button is-dark is-outlined is-rounded mr-0_75"
              :disabled="validationDisabled"
              type="submit"
            >
              <span>Valider</span>
              <i class="icon">
                <Icon v-if="isLoading" size="16" name="loader-2-line" />
                <Icon v-else size="16" name="check" />
              </i>
            </button>
            <button
              v-else
              class="button is-dark is-outlined is-rounded mr-0_75"
              type="input"
            >
              <span>Je ne sais pas / Je passe</span>
              <i class="icon">
                <Icon v-if="isLoading" size="16" name="loader-2-line" />
                <Icon v-else size="16" name="arrow-right-line" />
              </i>
            </button>
            <span v-if="isLoading" class="is-size-7 has-text-shade-600"
              >en cours de chargement</span
            >
            <span
              v-else
              class="is-size-7 has-text-shade-600 hidden-in-mobile-mode"
            >
              appuyez sur
              <span class="has-text-weight-bold">Entrer ⏎</span>
            </span>
          </div>
          <div class="is-flex buttons rounds">
            <NuxtLink
              :to="`/resultats/${assessmentStore.currentAssessmentId}?question=${question.id}`"
              class="button is-dark is-outlined is-rounded"
            >
              <i class="icon">
                <Icon size="16" name="bar-chart-box" />
              </i>
            </NuxtLink>
            <NuxtLink
              :to="`/demometre?question=${question.id}`"
              class="button is-dark is-outlined is-rounded"
            >
              <i class="icon">
                <Icon size="16" name="question-mark" />
              </i>
            </NuxtLink>
          </div>
        </div>
      </form>
    </section>
    <section
      v-if="tabs.length"
      id="menu"
      class="section container is-tight pb-0 pt-0 mt-1"
      :class="`menu is-${color}`"
      style="width: 100%"
    >
      <div class="tabs has-background-shade-600" style="width: 100%">
        <ul>
          <li v-for="tab of tabs" :key="tab.id">
            <a
              class="tab is-size-5"
              :class="
                tab.id === currentTabId
                  ? `is-active`
                  : `has-text-${color}-light`
              "
              @click="setTab(tab.id)"
              >{{ tab.label }}</a
            >
          </li>
        </ul>
        <button
          :class="`button is-shade-600 has-text-${color}-light-hover is-large`"
          @click.prevent="isTabsOpen = !isTabsOpen"
        >
          <i class="icon">
            <Icon v-if="isTabsOpen" size="28" name="arrow-down-line" />
            <Icon v-else size="28" name="arrow-up-line" />
          </i>
        </button>
      </div>
      <div v-if="isTabsOpen">
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
        <div
          v-for="element of explanatory"
          :key="element.title.replace(/\s+/g, '')"
        >
          <div v-show="currentTabId === element.title.replace(/\s+/g, '')">
            <RichText :rich-text="element.description" />
          </div>
        </div>
      </div>
    </section>
  </div>
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
  SimpleBlock,
} from "~/composables/types"
import { computed, PropType, watch } from "vue"
import { ref } from "@vue/reactivity"
import { useDefinitionStore } from "~/stores/definitionStore"
import { useParticipationStore } from "~/stores/participationStore"
import { getQuestionResponseValue } from "~/utils/question-response"
import { useQuestionnaireStore } from "~/stores/questionnaireStore"
import { useAssessmentStore } from "~/stores/assessmentStore"

type tabDef = { label: string; id: string }
const props = defineProps({
  questionId: { type: Number, required: true },
  context: { type: Object as PropType<QuestionContextProps>, required: true },
  color: { type: String, required: true },
})

const participationStore = useParticipationStore()
const assessmentStore = useAssessmentStore()
const questionnaireStore = useQuestionnaireStore()
const definitionStore = useDefinitionStore()

const isAnswered = computed(() => {
  if (Array.isArray(answer.value)) return !!answer.value.length
  return !!answer.value || answer.value === 0 || answer.value === false
})

const question = computed(() => {
  return props.context.questionById[props.questionId]
})

const criteria = computed(() => {
  return questionnaireStore.criteriaById[question.value.criteriaId]
})

const initialValue = getQuestionResponseValue(
  props.context.responseByQuestionId[props.questionId],
  question.value.type
)

const answer = ref(initialValue)
const isLoading = ref(false)
const isTabsOpen = ref(false)

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
  definitionStore.definitionsByIdArray(criteria.value.definitionIds)
)

const tabs = ref<tabDef[]>([])
if (criteria.value?.definitionIds.length > 0) {
  tabs.value.push({
    label: "Définitions",
    id: "definitions",
  })
}
const explanatory = (criteria.value?.explanatory || []) as SimpleBlock[]
if (explanatory.length) {
  explanatory.forEach((element) => {
    tabs.value.push({
      label: `${element.title}`,
      id: `${element.title.replace(/\s+/g, "")}`,
    })
  })
}
const currentTabId = ref<string>(tabs.value[0]?.id)

function setTab(tabId) {
  currentTabId.value = tabId
  isTabsOpen.value = true
}

const goToPreviousQuestion = () => {
  isLoading.value = true
  props.context.journey.goToPreviousQuestion(question.value.id)
}

const goToNextQuestion = () => {
  isLoading.value = true
  props.context.journey.goToNextQuestion(question.value.id)
}

const submit = async () => {
  isLoading.value = true
  const result = await participationStore.saveResponse(
    question.value,
    answer.value,
    isAnswered.value
  )
  if (result) {
    if (props.context.journey.isLastQuestion(question.value.id)) {
      if (props.context.journey.surveyType() === SurveyType.INITILIZATION) {
        // await assessmentStore.saveEndInitializationQuestions()
      } else if (
        props.context.journey.surveyType() === SurveyType.QUESTIONNAIRE
      ) {
        await participationStore.saveEndQuestionnaire(
          false,
          question.value.pillarId
        )
      }
    }
    goToNextQuestion()
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

.menu
  z-index: 1
  position: fixed
  bottom: 0
  background-color: white
  max-height: 50%
  overflow: overlay

.tabs ul
  border: 2px solid $shade-600

.tabs .tab
  color: var(--color)
  border-bottom-color: $shade-600
  &.is-active
    color: var(--color-dark)
    background-color: white
  &:hover
    color: var(--color-hover)
</style>
