<script setup>
defineProps({
  canGoBack: {
    type: Boolean,
    default: false,
  },
  canGoNext: {
    type: Boolean,
    default: false,
  },
  isLastStep: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <div class="flex justify-between mt-6">
    <button class="px-4 py-2 rounded bg-gray-100 disabled:opacity-50" :disabled="!canGoBack">
      Назад
    </button>

    <button
      class="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
      :disabled="!canGoNext"
    >
      {{ isLastStep ? 'Завершить' : 'Далее' }}
    </button>
  </div>
</template>
