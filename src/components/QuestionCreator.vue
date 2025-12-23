<!-- QuestionCreator.vue -->
<script setup>
import { ref, watch, reactive, nextTick } from 'vue'

const emit = defineEmits(['add-question'])

const newQuestion = ref({
  id: '',
  title: '',
  description: '',
  type: 'radio',
  placeholder: '',
  options: [{ value: '1', label: '' }], // Начальное значение уже 1
})

// Состояние ошибок для каждого поля
const errors = reactive({
  id: false,
  title: false,
  options: false,
})

// Автоматически обновляем value при добавлении/удалении опций
watch(
  () => newQuestion.value.options.length,
  () => {
    updateOptionValues()
  },
  { immediate: true },
)

function updateOptionValues() {
  newQuestion.value.options.forEach((option, index) => {
    option.value = (index + 1).toString() // Автоматическое значение от 1 и далее
  })
}

function addOption() {
  newQuestion.value.options.push({ value: '', label: '' })
  // Значение обновится автоматически через watch
}

function removeOption(index) {
  if (newQuestion.value.options.length > 1) {
    newQuestion.value.options.splice(index, 1)
    // Значение обновится автоматически через watch
  }
}

function clearOptionError() {
  if (errors.options) errors.options = false
}

function addQuestion() {
  // Сброс ошибок перед валидацией
  resetErrors()

  if (!validateQuestion()) {
    highlightErrors()
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
  let isValid = true

  // Проверка ID
  if (!newQuestion.value.id.trim()) {
    errors.id = true
    isValid = false
  }

  // Проверка заголовка
  if (!newQuestion.value.title.trim()) {
    errors.title = true
    isValid = false
  }

  // Проверка опций для не-текстовых вопросов
  if (newQuestion.value.type !== 'text') {
    const hasEmptyLabels = newQuestion.value.options.some((opt) => !opt.label.trim())
    if (hasEmptyLabels) {
      errors.options = true
      isValid = false
    }
  }

  return isValid
}

function highlightErrors() {
  // Подсветка уже установлена в validateQuestion
}

function resetErrors() {
  errors.id = false
  errors.title = false
  errors.options = false
}

function resetForm() {
  newQuestion.value = {
    id: '',
    title: '',
    description: '',
    type: 'radio',
    placeholder: '',
    options: [{ value: '1', label: '' }], // Явно задаём начальное значение
  }
  resetErrors()

  // Принудительно обновляем значения после сброса
  nextTick(() => {
    if (newQuestion.value.type !== 'text') {
      updateOptionValues()
    }
  })
}

watch(
  () => newQuestion.value.type,
  (newType) => {
    if (newType === 'text') {
      newQuestion.value.options = [{ value: '1', label: '' }] // Явно задаём значение
      errors.options = false
    } else if (newQuestion.value.options.length === 0) {
      newQuestion.value.options = [{ value: '1', label: '' }] // Явно задаём значение
      nextTick(() => updateOptionValues())
    } else {
      nextTick(() => updateOptionValues())
    }
  },
)

// Сброс ошибок при вводе
watch(
  () => newQuestion.value.id,
  () => {
    if (errors.id) errors.id = false
  },
)

watch(
  () => newQuestion.value.title,
  () => {
    if (errors.title) errors.title = false
  },
)

watch(
  () => newQuestion.value.options,
  () => {
    if (errors.options) errors.options = false
  },
  { deep: true },
)

// Принудительное обновление при монтировании
function initForm() {
  if (newQuestion.value.type !== 'text') {
    updateOptionValues()
  }
}

// Вызываем при инициализации
initForm()
</script>

<template>
  <div class="bg-white rounded-2xl shadow p-6">
    <h2 class="text-xl font-semibold mb-4">Создать новый вопрос</h2>

    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1"> ID вопроса * </label>
        <input
          v-model="newQuestion.id"
          type="text"
          :class="[
            'border rounded p-2 w-full transition-colors',
            errors.id ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300',
          ]"
          placeholder="Например: travel_frequency"
          @input="errors.id = false"
        />
        <p v-if="errors.id" class="mt-1 text-sm text-red-600">Поле обязательно для заполнения</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1"> Заголовок вопроса * </label>
        <input
          v-model="newQuestion.title"
          type="text"
          :class="[
            'border rounded p-2 w-full transition-colors',
            errors.title ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300',
          ]"
          placeholder="Как часто вы путешествуете?"
          @input="errors.title = false"
        />
        <p v-if="errors.title" class="mt-1 text-sm text-red-600">Поле обязательно для заполнения</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1"> Описание вопроса </label>
        <textarea
          v-model="newQuestion.description"
          class="border border-gray-300 rounded p-2 w-full"
          placeholder="Выберите наиболее подходящий вариант"
          rows="2"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1"> Тип вопроса * </label>
        <select v-model="newQuestion.type" class="border border-gray-300 rounded p-2 w-full">
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
          class="border border-gray-300 rounded p-2 w-full"
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

        <div class="text-sm text-gray-500 mb-2">Value заполняется автоматически (1, 2, 3...)</div>

        <div v-for="(option, index) in newQuestion.options" :key="index" class="flex gap-2 mb-2">
          <div class="flex-1">
            <div class="border rounded p-2 bg-gray-50 text-gray-600 text-center">
              {{ option.value || index + 1 }}
              <!-- Добавил fallback -->
            </div>
          </div>
          <div class="flex-1">
            <input
              v-model="option.label"
              type="text"
              :class="[
                'border rounded p-2 w-full transition-colors',
                errors.options && !option.label.trim()
                  ? 'border-red-500 ring-1 ring-red-500'
                  : 'border-gray-300',
              ]"
              :placeholder="'Ответ ' + (index + 1)"
              @input="clearOptionError"
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
        <p v-if="errors.options" class="mt-1 text-sm text-red-600">
          Все варианты ответов должны быть заполнены
        </p>
      </div>

      <div class="flex gap-2">
        <button
          @click="addQuestion"
          class="flex-1 px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
        >
          Добавить вопрос
        </button>
        <button
          @click="resetForm"
          class="flex-1 px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
        >
          Очистить форму
        </button>
      </div>
    </div>
  </div>
</template>
