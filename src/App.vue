<!-- App.vue -->
<script setup>
import { ref, watch } from 'vue'
import SurveyForm from './components/SurveyForm.vue'
import SummaryPanel from './components/SummaryPanel.vue'
import QuestionCreator from './components/QuestionCreator.vue'
import QuestionManager from './components/QuestionManager.vue'
import { surveyQuestions } from './data/questions.js'

const STORAGE_KEYS = {
  QUESTIONS: 'survey_app_questions',
  ANSWERS: 'survey_app_answers',
  CURRENT_STEP: 'survey_app_current_step',
}

// Переименуем функцию или используем утилиту lodash-es
function debounceFn(func, wait) {
  // Изменили имя на debounceFn
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Загрузка данных
function loadFromStorage() {
  try {
    const savedQuestions = localStorage.getItem(STORAGE_KEYS.QUESTIONS)
    const savedAnswers = localStorage.getItem(STORAGE_KEYS.ANSWERS)
    const savedStep = localStorage.getItem(STORAGE_KEYS.CURRENT_STEP)

    return {
      questions: savedQuestions ? JSON.parse(savedQuestions) : [...surveyQuestions],
      answers: savedAnswers ? JSON.parse(savedAnswers) : {},
      currentStep: savedStep ? parseInt(savedStep) : 0,
    }
  } catch (e) {
    console.error('Ошибка загрузки из localStorage:', e)
    return {
      questions: [...surveyQuestions],
      answers: {},
      currentStep: 0,
    }
  }
}

// Сохранение данных с debounce
const saveToStorage = debounceFn((data) => {
  // Используем debounceFn
  try {
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(data.questions))
    localStorage.setItem(STORAGE_KEYS.ANSWERS, JSON.stringify(data.answers))
    localStorage.setItem(STORAGE_KEYS.CURRENT_STEP, data.currentStep.toString())
  } catch (e) {
    console.error('Ошибка сохранения в localStorage:', e)
  }
}, 500)

// Инициализация данных
const loadedData = loadFromStorage()
const answers = ref(loadedData.answers)
const questions = ref(loadedData.questions)
const currentStep = ref(loadedData.currentStep)

// Автоматическое сохранение при изменениях
watch(
  () => ({
    questions: questions.value,
    answers: answers.value,
    currentStep: currentStep.value,
  }),
  (newData) => {
    saveToStorage(newData)
  },
  { deep: true, immediate: true },
)

function onAnswer({ id, value }) {
  answers.value = {
    ...answers.value,
    [id]: value,
  }
}

function resetSurvey() {
  answers.value = {}
  currentStep.value = 0
}

function addQuestion(newQuestion) {
  questions.value.push(newQuestion)
}

function updateQuestion(updatedQuestion) {
  const index = questions.value.findIndex((q) => q.id === updatedQuestion.id)
  if (index !== -1) {
    questions.value[index] = updatedQuestion
  }
}

function deleteQuestion(questionId) {
  const index = questions.value.findIndex((q) => q.id === questionId)
  if (index !== -1) {
    questions.value.splice(index, 1)
    if (currentStep.value >= questions.value.length) {
      currentStep.value = Math.max(0, questions.value.length - 1)
    }
    const { [questionId]: deleted, ...restAnswers } = answers.value
    answers.value = restAnswers
  }
}

function updateCurrentStep(step) {
  currentStep.value = step
}

function resetApp() {
  if (confirm('Вы уверены? Это удалит все вопросы и ответы.')) {
    localStorage.clear()
    questions.value = [...surveyQuestions]
    answers.value = {}
    currentStep.value = 0
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 text-gray-900">
    <div class="max-w-7xl mx-auto p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold">Опрос о путешествиях</h1>
        <button
          @click="resetApp"
          class="px-4 py-2 rounded bg-red-100 text-red-700 hover:bg-red-200 text-sm"
          title="Полный сброс приложения"
        >
          Сбросить всё
        </button>
      </div>

      <div class="grid gap-6 lg:grid-cols-3">
        <div class="lg:col-span-1 space-y-6">
          <QuestionCreator @add-question="addQuestion" />
          <QuestionManager
            :questions="questions"
            @update-question="updateQuestion"
            @delete-question="deleteQuestion"
          />
        </div>

        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white rounded-2xl shadow p-6">
            <SurveyForm
              :questions="questions"
              :answers="answers"
              :current-step="currentStep"
              @answer="onAnswer"
              @update:current-step="updateCurrentStep"
            />
          </div>

          <SummaryPanel :answers="answers" :survey-questions="questions" @reset="resetSurvey" />
        </div>
      </div>

      <div class="mt-6 text-sm text-gray-500 text-center">
        Данные сохраняются автоматически в вашем браузере
      </div>
    </div>
  </div>
</template>
