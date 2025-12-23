<script setup>
import { ref, computed } from 'vue'
import ProgressBar from './card/ProgressBar.vue'
import QuestionCard from './card/QuestionCard.vue'
import NavigationButtons from './card/NavigationButtons.vue'

const props = defineProps({
  questions: {
    type: Array,
    default: () => [],
  },
  answers: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits({ answer: null })

const currentStep = ref(0)
const currentQuestion = computed(() => props.questions[currentStep.value])
const currentAnswerQuestion = computed(() => props.answers[currentQuestion.value.id])
const isLastStep = computed(() => currentStep.value === props.questions.length - 1)

const canGoNext = computed(() => {
  const question = currentQuestion.value
  if (!question) {
    return false
  }
  const answer = props.answers[question.id]
  if (question.type === 'checkbox') {
    return Array.isArray(answer) && answer.length > 0
  }

  return !!answer
})

function onAnswer() {}

function onGoNext() {
  if (!canGoNext.value) return
  if (!isLastStep.value) currentStep.value++
}
function onGoBack() {
  if (currentStep.value > 0) currentStep.value--
}
</script>

<template>
  <ProgressBar :current-step="currentStep" :total-steps="questions.length" />

  <QuestionCard
    v-if="currentQuestion"
    :question="currentQuestion"
    :answer-question="currentAnswerQuestion"
  />

  <NavigationButtons
    :can-go-back="currentStep > 0"
    :can-go-next="canGoNext"
    :is-last-step="isLastStep"
  />
</template>
