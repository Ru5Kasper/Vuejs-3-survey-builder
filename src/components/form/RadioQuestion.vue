<script setup>
defineProps({
  options: {
    type: Array,
    required: true,
  },
  name: {
    type: String,
    default: 'radio-group',
  },
})
const modelValue = defineModel({ type: [String, Number] })
</script>

<template>
  <div class="space-y-2">
    <label
      v-for="option in options"
      :key="option.value"
      class="flex items-center gap-2 cursor-pointer"
    >
      <input type="radio" :name="name" :value="option.value" v-model="modelValue" />
      <span>{{ option.label }}</span>
    </label>
  </div>
</template>
