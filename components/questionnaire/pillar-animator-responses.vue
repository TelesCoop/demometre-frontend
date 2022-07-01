<template>
  <div class="columns">
    <aside class="menu column is-5 mr-2">
      <div class="tabs">
        <ul
          :class="`has-text-${color}`"
          :style="`border-bottom-color: currentColor`"
        >
          <li class="is-active">
            <a
              :class="`has-text-${color}-dark`"
              :style="`border-bottom-color: currentColor`"
              >Questions</a
            >
          </li>
        </ul>
      </div>
      <ul class="menu-list">
        <li v-for="question of questions" :key="question.id">
          <a
            :class="[
              `has-text-${props.color}-dark `,
              question === activeQuestion && `has-background-${props.color}`,
              question.id === hoverQuestionId &&
                `has-background-${props.color}-light`,
            ]"
            @click="onSelectQuestion(question)"
            @mouseenter="hoverQuestionId = question.id"
            @mouseleave="hoverQuestionId = null"
          >
            <span :class="`has-text-${props.color}-active`">
              {{ question.concatenatedCode }}
            </span>
            {{ question.questionStatement }}
          </a>
        </li>
      </ul>
    </aside>
    <div class="content column is-7 mb-1_5">
      <h2 class="title is-4 mb-0_75" :class="`has-text-${props.color}-dark`">
        {{ wordTitleCase(props.pillar.name) }}
      </h2>
      <hr class="my-0_75" :class="`has-background-${props.color}`" />
      <div v-if="activeQuestion">
        <QuestionnaireQuestionStatement
          :color="props.color"
          :question="activeQuestion"
        >
          <table
            v-if="activeQuestion.objectivity === Objectivity.SUBJECTIVE"
            class="is-fullwidth"
          >
            <tr :class="`is-uppercase is-size-6bis pb-0_5`">
              <td class="pb-0_5">Participant·e·s</td>
              <td class="pb-0_5">Réponses</td>
            </tr>
            <tr
              v-for="participant of animatorStore.workshopById[props.workshopId]
                .participants"
              :key="participant.id"
            >
              <td class="pb-1 pr-0_75">
                <p
                  :class="`has-background-${props.color}-light is-fullheight py-0_5 px-1`"
                >
                  {{ participant.userUsername }}
                </p>
              </td>
              <td class="pb-1">
                <ResponseAnimator
                  v-model="participant.responseByQuestionId[activeQuestion.id]"
                  :question="activeQuestion"
                  :participant="participant"
                  :assessment-id="participant.assessmentId"
                  :color="props.color"
                />
              </td>
            </tr>
          </table>
          <div v-else>
            <p class="is-size-7 is-family-secondary mb-1">
              Réponse unique car question objective
            </p>
            <!-- TODO: make it works : v-model empty : not working -->
            <ResponseAnimator
              v-model="
                animatorStore.assessmentResponseByQuestionIdByWorkshopId[
                  props.workshopId
                ][activeQuestion.id]
              "
              :question="activeQuestion"
              :assessment-id="
                animatorStore.workshopById[props.workshopId].assessmentId
              "
              :color="props.color"
            />
          </div>
        </QuestionnaireQuestionStatement>
      </div>
      <div v-else>
        <p>Selectionner une question</p>
      </div>
      <div class="buttons mt-2">
        <button
          v-if="activeQuestionIndex + 1 < questions.length"
          :class="`button is-rounded is-${color} is-outlined has-text-${color}-active`"
          type="button"
          @click.prevent="nextQuestion()"
        >
          <span class="icon">
            <icon size="16" name="arrow-right-line" />
          </span>
          <span>Question suivante</span>
        </button>

        <button
          v-if="activeQuestion"
          :class="`button is-rounded is-${color} ml-auto`"
          type="button"
          @click.prevent="onSubmit"
        >
          <span>Valider les réponses</span>
          <span class="icon">
            <icon size="16" name="check" />
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useQuestionnaireStore } from "~/stores/questionnaireStore"
import { Question, Objectivity } from "~/composables/types"
import { wordTitleCase } from "~/utils/util"
import { useAnimatorStore } from "~/stores/animatorStore"

const questionnaireStore = useQuestionnaireStore()
const animatorStore = useAnimatorStore()

const props = defineProps({
  pillar: { type: Object, required: true },
  color: { type: String, required: true },
  workshopId: { type: Number, required: true },
})

const questions = computed<Question[]>(() =>
  questionnaireStore.getQuestionnaireQuestionByPillarName(props.pillar.name)
)
const activeQuestion = ref<Question>()
const hoverQuestionId = ref<number>()

const activeQuestionIndex = computed(() =>
  questions.value.indexOf(activeQuestion.value)
)

const onSelectQuestion = (question) => {
  activeQuestion.value = question
}

const nextQuestion = () => {
  activeQuestion.value = questions.value[activeQuestionIndex.value + 1]
}

watch(
  () => props.pillar,
  () => {
    activeQuestion.value = null
  }
)

async function onSubmit() {
  // TODO
}
</script>

<style scoped lang="sass"></style>
