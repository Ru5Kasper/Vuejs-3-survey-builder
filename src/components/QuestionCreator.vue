<!-- QuestionCreator.vue -->
<script setup>
import { ref, watch } from 'vue'

const emit = defineEmits(['add-question'])

const newQuestion = ref({
  id: '',
  title: '',
  description: '',
  type: 'radio',
  placeholder: '',
  options: [{ value: '', label: '' }],
})

function addOption() {
  newQuestion.value.options.push({ value: '', label: '' })
}

function removeOption(index) {
  if (newQuestion.value.options.length > 1) {
    newQuestion.value.options.splice(index, 1)
  }
}

function addQuestion() {
  if (!validateQuestion()) {
    alert('Пожалуйста, заполните все обязательные поля')
    return
  }

  const questionToAdd = {
    ...newQuestion.value,
    options: newQuestion.value.type === 'text' ? [] : [...newQuestion.value.options],
  }

  emit('add-question', questionToAdd)
  resetForm()
}

function validateQuestion() {
  if (!newQuestion.value.id.trim() || !newQuestion.value.title.trim()) {
    return false
  }

  if (newQuestion.value.type !== 'text') {
    return newQuestion.value.options.every((opt) => opt.value && opt.label)
  }

  return true
}

function resetForm() {
  newQuestion.value = {
    id: '',
    title: '',
    description: '',
    type: 'radio',
    placeholder: '',
    options: [{ value: '', label: '' }],
  }
}

watch(
  () => newQuestion.value.type,
  (newType) => {
    if (newType === 'text') {
      newQuestion.value.options = [{ value: '', label: '' }]
    } else if (newQuestion.value.options.length === 0) {
      newQuestion.value.options = [{ value: '', label: '' }]
    }
  },
)
</script>

<template>
  <div class="bg-white rounded-2xl shadow p-6 mb-6">
    <h2 class="text-xl font-semibold mb-4">Создать новый вопрос</h2>

    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1"> ID вопроса<red>*</red></label>
        <input
          v-model="newQuestion.id"
          type="text"
          class="border rounded p-2 w-full"
          placeholder="Например: travel_frequency"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Заголовок вопроса<red>*</red></label
        >
        <input
          v-model="newQuestion.title"
          type="text"
          class="border rounded p-2 w-full"
          placeholder="Как часто вы путешествуете?"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1"> Описание вопроса </label>
        <textarea
          v-model="newQuestion.description"
          class="border rounded p-2 w-full"
          placeholder="Выберите наиболее подходящий вариант"
          rows="2"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1"> Тип вопроса * </label>
        <select v-model="newQuestion.type" class="border rounded p-2 w-full">
          <option value="radio">Radio (один вариант)</option>
          <option value="checkbox">Checkbox (несколько вариантов)</option>
          <option value="select">Select (выпадающий список)</option>
          <option value="text">Text (текстовый ответ)</option>
        </select>
      </div>

      <div v-if="newQuestion.type === 'text'">
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Placeholder для текстового поля
        </label>
        <input
          v-model="newQuestion.placeholder"
          type="text"
          class="border rounded p-2 w-full"
          placeholder="Например: Исландия, Япония, Новая Зеландия"
        />
      </div>

      <div v-if="newQuestion.type !== 'text'">
        <div class="flex justify-between items-center mb-2">
          <label class="block text-sm font-medium text-gray-700"> Варианты ответов * </label>
          <button
            type="button"
            @click="addOption"
            class="text-sm text-blue-600 hover:text-blue-800"
          >
            + Добавить вариант
          </button>
        </div>

        <div v-for="(option, index) in newQuestion.options" :key="index" class="flex gap-2 mb-2">
          <div class="flex-1">
            <input
              v-model="option.value"
              type="text"
              class="border rounded p-2 w-full"
              :placeholder="'value' + (index + 1)"
            />
          </div>
          <div class="flex-1">
            <input
              v-model="option.label"
              type="text"
              class="border rounded p-2 w-full"
              :placeholder="'label' + (index + 1)"
            />
          </div>
          <button
            v-if="newQuestion.options.length > 1"
            type="button"
            @click="removeOption(index)"
            class="text-red-600 hover:text-red-800"
          >
            ×
          </button>
        </div>
      </div>

      <button
        @click="addQuestion"
        class="w-full px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
      >
        Добавить вопрос в опрос
      </button>
    </div>
  </div>
</template>
