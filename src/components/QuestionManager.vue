<!-- QuestionManager.vue -->
<script setup>
import { ref, reactive, watch } from 'vue'

defineProps({
  questions: {
    type: Array,
    default: () => [],
  },
})

const editErrors = reactive({
  id: false,
  title: false,
  options: false,
})

const emit = defineEmits(['update-question', 'delete-question'])

const editingQuestion = ref(null)

// Автоматическое обновление value при редактировании
watch(
  () => editingQuestion.value?.options,
  (options) => {
    if (options && editingQuestion.value?.type !== 'text') {
      updateEditOptionValues()
    }
  },
  { deep: true, immediate: true },
)

function updateEditOptionValues() {
  if (editingQuestion.value && editingQuestion.value.type !== 'text') {
    editingQuestion.value.options.forEach((option, index) => {
      option.value = (index + 1).toString()
    })
  }
}

function startEdit(question) {
  editingQuestion.value = { ...question }
  if (editingQuestion.value.type !== 'text') {
    editingQuestion.value.options = [...question.options]
    // Обновляем значения при начале редактирования
    updateEditOptionValues()
  }
}

function saveEdit() {
  // Сброс ошибок
  editErrors.id = false
  editErrors.title = false
  editErrors.options = false

  if (!validateQuestion(editingQuestion.value)) {
    // Подсветка ошибок
    if (!editingQuestion.value.id.trim()) editErrors.id = true
    if (!editingQuestion.value.title.trim()) editErrors.title = true
    if (editingQuestion.value.type !== 'text') {
      const hasEmptyLabels = editingQuestion.value.options.some((opt) => !opt.label.trim())
      if (hasEmptyLabels) editErrors.options = true
    }

    alert('Пожалуйста, заполните все обязательные поля')
    return
  }

  const questionToUpdate = {
    ...editingQuestion.value,
    options: editingQuestion.value.type === 'text' ? [] : [...editingQuestion.value.options],
  }

  emit('update-question', questionToUpdate)
  editingQuestion.value = null
}

function cancelEdit() {
  editingQuestion.value = null
}

function handleDelete(questionId) {
  if (confirm('Вы уверены, что хотите удалить этот вопрос?')) {
    emit('delete-question', questionId)
  }
}

function validateQuestion(question) {
  if (!question.id.trim() || !question.title.trim()) {
    return false
  }

  if (question.type !== 'text') {
    return question.options.every((opt) => opt.label && opt.label.trim())
  }

  return true
}

function addOption() {
  editingQuestion.value.options.push({ value: '', label: '' })
}

function removeOption(index) {
  if (editingQuestion.value.options.length > 1) {
    editingQuestion.value.options.splice(index, 1)
  }
}
</script>

<template>
  <div class="bg-white rounded-2xl shadow p-6">
    <h2 class="text-xl font-semibold mb-4">Управление вопросами</h2>

    <!-- Форма редактирования -->
    <div v-if="editingQuestion" class="mb-6 p-4 border rounded-lg bg-gray-50">
      <h3 class="text-lg font-medium mb-3">Редактирование вопроса</h3>

      <div class="space-y-3">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"> ID вопроса * </label>
          <input
            v-model="editingQuestion.id"
            type="text"
            :class="[
              'border rounded p-2 w-full transition-colors',
              editErrors.id ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300',
            ]"
            placeholder="Например: travel_frequency"
          />
          <p v-if="editErrors.id" class="mt-1 text-sm text-red-600">
            Поле обязательно для заполнения
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"> Заголовок вопроса * </label>
          <input
            v-model="editingQuestion.title"
            type="text"
            :class="[
              'border rounded p-2 w-full transition-colors',
              editErrors.title ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300',
            ]"
            placeholder="Как часто вы путешествуете?"
          />
          <p v-if="editErrors.title" class="mt-1 text-sm text-red-600">
            Поле обязательно для заполнения
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"> Описание вопроса </label>
          <textarea
            v-model="editingQuestion.description"
            class="border border-gray-300 rounded p-2 w-full"
            placeholder="Выберите наиболее подходящий вариант"
            rows="2"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"> Тип вопроса * </label>
          <select v-model="editingQuestion.type" class="border border-gray-300 rounded p-2 w-full">
            <option value="radio">Radio (один вариант)</option>
            <option value="checkbox">Checkbox (несколько вариантов)</option>
            <option value="select">Select (выпадающий список)</option>
            <option value="text">Text (текстовый ответ)</option>
          </select>
        </div>

        <div v-if="editingQuestion.type === 'text'">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Placeholder для текстового поля
          </label>
          <input
            v-model="editingQuestion.placeholder"
            type="text"
            class="border border-gray-300 rounded p-2 w-full"
            placeholder="Например: Исландия, Япония, Новая Зеландия"
          />
        </div>

        <div v-if="editingQuestion.type !== 'text'">
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

          <div class="text-sm text-gray-500 mb-2">Value заполняется автоматически (1, 2, 3...)</div>

          <div
            v-for="(option, index) in editingQuestion.options"
            :key="index"
            class="flex gap-2 mb-2"
          >
            <div class="flex-1">
              <div class="border rounded p-2 bg-gray-50 text-gray-600 text-center">
                {{ option.value }}
              </div>
            </div>
            <div class="flex-1">
              <input
                v-model="option.label"
                type="text"
                :class="[
                  'border rounded p-2 w-full transition-colors',
                  editErrors.options && !option.label.trim()
                    ? 'border-red-500 ring-1 ring-red-500'
                    : 'border-gray-300',
                ]"
                :placeholder="'Ответ ' + (index + 1)"
              />
            </div>
            <button
              v-if="editingQuestion.options.length > 1"
              type="button"
              @click="removeOption(index)"
              class="text-red-600 hover:text-red-800 px-2"
            >
              ×
            </button>
          </div>
          <p v-if="editErrors.options" class="mt-1 text-sm text-red-600">
            Все варианты ответов должны быть заполнены
          </p>
        </div>

        <div class="flex gap-2 pt-2">
          <button
            @click="saveEdit"
            class="flex-1 px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
          >
            Сохранить изменения
          </button>
          <button
            @click="cancelEdit"
            class="flex-1 px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            Отмена
          </button>
        </div>
      </div>
    </div>

    <!-- Таблица вопросов -->
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              scope="col"
              class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              ID
            </th>
            <th
              scope="col"
              class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Заголовок
            </th>
            <th
              scope="col"
              class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Тип
            </th>
            <th
              scope="col"
              class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Вариантов
            </th>
            <th
              scope="col"
              class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Действия
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="question in questions" :key="question.id">
            <td class="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ question.id }}
            </td>
            <td class="px-3 py-4 text-sm text-gray-500">
              {{ question.title }}
            </td>
            <td class="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                :class="{
                  'bg-blue-100 text-blue-800': question.type === 'radio',
                  'bg-green-100 text-green-800': question.type === 'checkbox',
                  'bg-purple-100 text-purple-800': question.type === 'select',
                  'bg-yellow-100 text-yellow-800': question.type === 'text',
                }"
              >
                {{
                  question.type === 'radio'
                    ? 'Radio'
                    : question.type === 'checkbox'
                      ? 'Checkbox'
                      : question.type === 'select'
                        ? 'Select'
                        : 'Text'
                }}
              </span>
            </td>
            <td class="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ question.type === 'text' ? '—' : question.options?.length || 0 }}
            </td>
            <td class="px-3 py-4 whitespace-nowrap text-sm font-medium">
              <div class="flex space-x-2">
                <button @click="startEdit(question)" class="text-blue-600 hover:text-blue-900">
                  Редактировать
                </button>
                <button @click="handleDelete(question.id)" class="text-red-600 hover:text-red-900">
                  Удалить
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="questions.length === 0">
            <td colspan="5" class="px-3 py-4 text-sm text-gray-500 text-center">
              Нет вопросов. Создайте первый вопрос.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="mt-4 text-sm text-gray-500">Всего вопросов: {{ questions.length }}</div>
  </div>
</template>
