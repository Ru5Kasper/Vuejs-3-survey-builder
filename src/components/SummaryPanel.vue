<!-- SummaryPanel.vue -->
<script setup>
import { ref } from 'vue' // Убрали emit из импорта

const props = defineProps({
  answers: {
    type: Object,
    default: () => ({}), // Исправлено: () => ({}) вместо () => ([])
  },
  surveyQuestions: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['reset'])

// Индикатор сохранения
const isSaved = ref(true)

function getDisplayValue(question, answer) {
  if (!answer && answer !== 0) return '—'

  if (question.type === 'checkbox' || question.type === 'radio' || question.type === 'select') {
    const options = question.options || []

    if (Array.isArray(answer)) {
      return answer
        .map((val) => {
          const option = options.find((opt) => opt.value === val)
          return option ? option.label : val
        })
        .join(', ')
    } else {
      const option = options.find((opt) => opt.value === answer)
      return option ? option.label : answer
    }
  }

  return answer
}
</script>

<template>
  <div class="bg-white rounded-2xl shadow p-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-semibold">Ваши ответы</h2>
      <span v-if="isSaved" class="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
        Сохранено
      </span>
    </div>

    <div class="space-y-3">
      <div v-for="question in surveyQuestions" :key="question.id" class="border rounded-lg p-3">
        <div class="text-sm text-gray-500">{{ question.title }}</div>
        <div class="font-medium">
          {{ getDisplayValue(question, answers[question.id]) }}
        </div>
      </div>
    </div>

    <button
      class="mt-6 px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 w-full"
      @click="$emit('reset')"
    >
      Начать заново
    </button>
  </div>
</template>
