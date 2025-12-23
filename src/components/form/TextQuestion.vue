<script setup>
defineProps({
  placeholder: String,
})

const modelValue = defineModel({ type: String })
</script>

<template>
  <input
    type="text"
    v-model="modelValue"
    :placeholder="placeholder"
    class="border rounded p-2 w-full"
  />
</template>
