<!-- SurveyForm.vue -->
<script setup>
import { ref, computed, watch } from 'vue'
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
  currentStep: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits(['answer', 'update:currentStep'])

const internalCurrentStep = ref(props.currentStep)

const currentQuestion = computed(() => props.questions[internalCurrentStep.value])
const currentAnswer = computed(() => props.answers[currentQuestion.value?.id])
const isLastStep = computed(() => internalCurrentStep.value === props.questions.length - 1)

const canGoNext = computed(() => {
  const question = currentQuestion.value
  if (!question) {
    return false
  }
  const answer = props.answers[question.id]
  if (question.type === 'checkbox') {
    return Array.isArray(answer) && answer.length > 0
  }
  return answer !== undefined && answer !== null && answer !== ''
})

function onAnswer({ id, value }) {
  emit('answer', { id, value })
}

function onGoNext() {
  if (!canGoNext.value) return
  if (!isLastStep.value) {
    internalCurrentStep.value++
    emit('update:currentStep', internalCurrentStep.value)
  }
}

function onGoBack() {
  if (internalCurrentStep.value > 0) {
    internalCurrentStep.value--
    emit('update:currentStep', internalCurrentStep.value)
  }
}

// Синхронизация внешнего и внутреннего состояния
watch(
  () => props.currentStep,
  (newStep) => {
    internalCurrentStep.value = newStep
  },
)
</script>

<template>
  <div>
    <ProgressBar :current-step="internalCurrentStep" :total-steps="questions.length" />

    <QuestionCard
      v-if="currentQuestion"
      :question="currentQuestion"
      :answer-question="currentAnswer"
      @answer="onAnswer"
    />

    <NavigationButtons
      :can-go-back="internalCurrentStep > 0"
      :can-go-next="canGoNext"
      :is-last-step="isLastStep"
      @go-next="onGoNext"
      @go-back="onGoBack"
    />
  </div>
</template>
