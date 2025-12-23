<script setup>
defineProps({
  options: { type: Array, required: true },
})

const modelValue = defineModel({ type: [String, Number] })
</script>

<template>
  <select class="border rounded p-2 w-full bg-white" v-model="modelValue">
    <option value="" disabled>Выберите вариант...</option>
    <option v-for="option in options" :key="option.value" :value="option.value">
      {{ option.label }}
    </option>
  </select>
</template>
