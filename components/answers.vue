<template>
    <div>
        <Answer
            v-for="(answer, answerIndex) of props.answers"
            :title="answer.title"
            :description="answer.description"
            :answer-index="answerIndex"
            :selected="isAnswerSelected(answer.id)"
            @click="selectAnswer(answer.id)"
        />
    </div>
</template>

<script setup lang="ts">
import { computed, PropType, onMounted, onDeactivated } from 'vue'
import { Answer as AnswerType } from '~/composables/types'

const props = defineProps({ answers: { type: Array as PropType<Array<AnswerType>>, required: true }, modelValue: { type: Number, required: false } })
const isAnswerSelected = computed(() => (answerId) => answerId === props.modelValue)

const emit = defineEmits(['update:modelValue', 'validate'])
const selectAnswer = (answerId) => {
    emit("update:modelValue", answerId)
}

// handle keyboard
const nextAnswer = (ev) => {
    const currentAnswerIndex = props.answers.findIndex(answer => answer.id === props.modelValue)
    if (currentAnswerIndex === props.answers.length - 1) {
        return
    }
    ev.preventDefault()
    selectAnswer(props.answers[currentAnswerIndex + 1].id)
}
const previousAnswer = (ev) => {
    const currentAnswerIndex = props.answers.findIndex(answer => answer.id === props.modelValue)
    if (currentAnswerIndex === 0) {
        return
    }
    ev.preventDefault()
    selectAnswer(props.answers[currentAnswerIndex - 1].id)
}
const onKeyDown = (ev) => {
    console.log("### ev", ev)
    if (ev.key === "ArrowUp") {
        previousAnswer(ev)
        return
    }
    if (ev.key === "ArrowDown") {
        nextAnswer(ev)
        return
    }
    if (ev.key === "Enter") {
        ev.preventDefault()
        emit('validate')
    }
}
onMounted(() => {
    window.addEventListener('keydown', onKeyDown)
})
onDeactivated(() => {
    window.removeEventListener('keydown', onKeyDown)
})

</script>

<style>
.answer + .answer {
    margin-top: 10px;
}
</style>