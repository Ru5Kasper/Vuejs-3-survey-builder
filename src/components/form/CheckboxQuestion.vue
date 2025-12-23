<script setup>
defineProps({
  options: { type: Array, required: true },
})

const modelValue = defineModel({ type: Array, default: () => [] })
</script>

<template>
  <div class="space-y-2">
    <label
      v-for="option in options"
      :key="option.value"
      class="flex items-center gap-2 cursor-pointer"
    >
      <input type="checkbox" v-model="modelValue" :value="option.value" />
      <span>{{ option.label }}</span>
    </label>
  </div>
</template>
