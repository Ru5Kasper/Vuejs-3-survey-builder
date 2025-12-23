<script setup>
defineProps({
  answers: {
    type: Object,
    default: () => ({}),
  },
  surveyQuestions: {
    type: Array,
    default: () => [],
  },
})

defineEmits(['reset'])

function getDisplayValue(question, answer) {
  if (!answer && answer !== 0) return '—'

  if (question.type === 'checkbox' || question.type === 'radio' || question.type === 'select') {
    const options = question.options || []

    if (Array.isArray(answer)) {
      // Для checkbox - массив значений
      return answer
        .map((val) => {
          const option = options.find((opt) => opt.value === val)
          return option ? option.label : val
        })
        .join(', ')
    } else {
      // Для radio/select - одно значение
      const option = options.find((opt) => opt.value === answer)
      return option ? option.label : answer
    }
  }

  // Для text вопросов
  return answer
}
</script>

<template>
  <div class="bg-white rounded-2xl shadow p-6">
    <h2 class="text-xl font-semibold mb-4">Ваши ответы</h2>
    <div class="space-y-3">
      <div v-for="question in surveyQuestions" :key="question.id" class="border rounded-lg p-3">
        <div class="text-sm text-gray-500">{{ question.title }}</div>
        <div class="font-medium">
          {{ getDisplayValue(question, answers[question.id]) }}
        </div>
      </div>
    </div>

    <button class="mt-6 px-4 py-2 rounded bg-gray-100 hover:bg-gray-200" @click="$emit('reset')">
      Начать заново
    </button>
  </div>
</template>
