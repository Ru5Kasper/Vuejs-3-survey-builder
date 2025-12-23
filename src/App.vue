<script setup>
import { ref } from 'vue'
import SurveyForm from './components/SurveyForm.vue'
import SummaryPanel from './components/SummaryPanel.vue'
import QuestionCreator from './components/QuestionCreator.vue'
import { surveyQuestions } from './data/questions.js'

const answers = ref({})
const questions = ref([...surveyQuestions])

function onAnswer({ id, value }) {
  answers.value = {
    ...answers.value,
    [id]: value,
  }
}

function resetSurvey() {
  answers.value = {}
  // Если нужно сбросить и текущий шаг, можно добавить логику сюда
}

function addQuestion(newQuestion) {
  questions.value.push(newQuestion)
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 text-gray-900">
    <div class="max-w-6xl mx-auto p-6">
      <h1 class="text-3xl font-bold mb-6">Опрос о путешествиях</h1>

      <QuestionCreator @add-question="addQuestion" />

      <div class="grid gap-6 md:grid-cols-2">
        <div class="bg-white rounded-2xl shadow p-6">
          <SurveyForm :questions="questions" :answers="answers" @answer="onAnswer" />
        </div>

        <SummaryPanel :answers="answers" :survey-questions="questions" @reset="resetSurvey" />
      </div>
    </div>
  </div>
</template>
