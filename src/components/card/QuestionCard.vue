<!-- QuestionCard.vue -->
<script setup>
import RadioQuestion from '../form/RadioQuestion.vue'
import CheckboxQuestion from '../form/CheckboxQuestion.vue'
import TextQuestion from '../form/TextQuestion.vue'
import SelectQuestion from '../form/SelectQuestion.vue'
import { computed } from 'vue'

const props = defineProps({
  question: { type: Object, required: true },
  answerQuestion: { type: [String, Number, Array], required: false },
})

const emit = defineEmits(['answer'])

const componentMap = {
  radio: RadioQuestion,
  checkbox: CheckboxQuestion,
  text: TextQuestion,
  select: SelectQuestion,
}

const currentComponent = computed(() => componentMap[props.question.type])

const normalizedProps = computed(() => {
  if (props.question.type === 'text') {
    return {
      placeholder: props.question.placeholder,
    }
  }
  return {
    options: props.question.options,
  }
})

// Используем computed для v-model
const localAnswer = computed({
  get: () => props.answerQuestion,
  set: (value) => {
    emit('answer', { id: props.question.id, value })
  },
})
</script>

<template>
  <div class="mb-6">
    <h2 class="text-xl font-semibold mb-2">{{ question.title }}</h2>
    <p v-if="question.description" class="text-gray-500 mb-3">
      {{ question.description }}
    </p>

    <component :is="currentComponent" v-model="localAnswer" v-bind="normalizedProps" />
  </div>
</template>
