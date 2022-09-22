<template>
  <div v-if="question">
    <section class="section">
      <form
        v-if="question"
        class="questionnaire-container"
        @submit.prevent="submit"
      >
        <h1
          class="title is-size-3-tablet is-size-4-mobile"
          :class="`has-text-${props.color}-dark`"
        >
          {{ question.questionStatement }}
        </h1>
        <RichText
          v-if="question.description"
          class="is-family-secondary"
          :class="`has-text-${props.color}-dark`"
          :rich-text="question.description"
        ></RichText>
        <section
          id="menu"
          class="section container is-tight pb-0 pt-0 mt-1"
          :class="`menu is-${color}`"
          style="width: 100%"
        >
          <div v-if="tabs.length > 1" class="tabs" style="width: 100%">
            <ul>
              <li v-for="tab of tabs" :key="tab.id">
                <a
                  class="tab is-size-6"
                  :class="[
                    `is-${color}`,
                    tab.id === currentTabId ? `is-active` : ``,
                  ]"
                  @click="setTab(tab.id)"
                  >{{ tab.label }}</a
                >
              </li>
            </ul>
          </div>
          <div>
            <!-- TAB : definitions -->
            <div v-show="currentTabId === 'definitions'" v-if="definitions">
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

            <!-- TAB : explanations -->
            <div
              v-for="element of explanatory"
              :key="element.title.replace(/\s+/g, '')"
            >
              <div v-show="currentTabId === element.title.replace(/\s+/g, '')">
                <RichText :rich-text="element.description" />
              </div>
            </div>

            <!-- TAB : responses -->
            <div v-show="currentTabId === 'responses'">
              <!-- Center bloc : question inputs + button previous and next -->
              <div
                class="nav-questionnaire-container"
                style="position: relative"
              >
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
                      question.maxMultipleChoices ||
                      question.responseChoices.length
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

                <!-- end inputs -->
                <div class="button-bar my-1_5">
                  <div class="is-flex is-align-items-center">
                    <button
                      v-if="isAnswered || question.mandatory"
                      :class="
                        props.color === 'no-pillar'
                          ? `is-shade-600`
                          : `is-${props.color} text-color-dark`
                      "
                      class="button is-rounded mr-0_75"
                      :disabled="validationDisabled"
                      type="submit"
                    >
                      <span>Valider</span>
                      <i class="icon">
                        <Icon v-if="isLoading" size="20" name="loader-2-line" />
                        <Icon v-else size="20" name="check" />
                      </i>
                    </button>
                    <button
                      v-else
                      :class="
                        props.color === 'no-pillar'
                          ? `is-shade-600`
                          : `is-${props.color} text-color-dark`
                      "
                      class="button is-outlined is-rounded mr-0_75"
                      type="input"
                    >
                      <span>Je ne sais pas / Je passe</span>
                      <i class="icon">
                        <Icon v-if="isLoading" size="20" name="loader-2-line" />
                        <Icon v-else size="20" name="arrow-right-line" />
                      </i>
                    </button>
                    <span v-if="isLoading" class="is-size-7 has-text-shade-600"
                      >en cours de chargement</span
                    >
                    <span
                      v-else
                      class="is-size-7 hidden-in-mobile-mode"
                      :class="
                        props.color === 'no-pillar'
                          ? 'has-text-shade-600'
                          : `has-text-${props.color}-dark`
                      "
                    >
                      appuyez sur
                      <span class="has-text-weight-bold">Entrer ⏎</span>
                    </span>
                  </div>
                  <div
                    v-if="props.isQuestionnaire"
                    class="is-flex buttons rounds"
                  >
                    <NuxtLink
                      :to="`/resultats/${assessmentStore.currentAssessmentId}?question=${question.id}`"
                      :class="`is-${props.color}`"
                      class="button is-outlined is-rounded text-color-hover results-button"
                      title="Voir les résultats"
                      target="_blank"
                    >
                      <i class="icon">
                        <Icon size="22" name="bar-chart-box" />
                      </i>
                    </NuxtLink>
                    <NuxtLink
                      :to="`/demometre?question=${question.id}`"
                      :class="`is-${props.color}`"
                      class="button is-outlined is-rounded text-color-hover"
                      title="Plus d'informations"
                      target="_blank"
                    >
                      <i class="icon">
                        <Icon size="16" name="question-mark" />
                      </i>
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </div>
            <!-- button previous next -->
            <ButtonsArrowButton
              v-if="
                !props.context.journey.isFirstQuestion(question.id) ||
                props.context.hasPreviousStep
              "
              class="arrow-button-fixed is-left"
              :color="props.color"
              @click.prevent="goToPreviousQuestion"
            />
            <ButtonsArrowButton
              class="arrow-button-fixed is-right"
              :disabled="nextQuestionDisabled"
              :color="props.color"
              @click.prevent="goToNextQuestion"
            />
          </div>
        </section>
      </form>
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
  isQuestionnaire: { type: Boolean, required: true },
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
  criteria.value?.definitionIds.length > 0
    ? definitionStore.definitionsByIdArray(criteria.value.definitionIds)
    : []
)

const tabs = ref<tabDef[]>([])
tabs.value.push({
  label: "Réponses",
  id: "responses",
})
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
.buttons.rounds .results-button
  height: 60px
  width: 60px

.tabs .tab
  color: var(--color)
  border-bottom-color: currentColor
  padding: 0.5em 1.5em 0.5em 0em
  &.is-active
    color: var(--color-active)
  &:hover
    color: var(--color-hover)
</style>
