<script setup>
import { ref } from 'vue'
import SurveyForm from './components/SurveyForm.vue'
import SummaryPanel from './components/SummaryPanel.vue'
import { surveyQuestions } from './data/questions.js'

const answers = ref({})

function onAnswer() {}
function resetSurvey() {}
</script>

<template>
  <div class="min-h-screen bg-gray-50 text-gray-900">
    <div class="max-w-6xl mx-auto p-6">
      <h1 class="text-3xl font-bold mb-6">Опрос о путешествиях</h1>

      <div class="grid gap-6 md:grid-cols-2">
        <div class="bg-white rounded-2xl shadow p-6">
          <SurveyForm  />
        </div>

        <SummaryPanel :answers="answers" :survey-questions="surveyQuestions" />
      </div>
    </div>
  </div>
</template>
