<template>
  <div class="flex rounded-t-md overflow-hidden">
    <!-- border-b-2 border-[#79ae70]  -->
    <button
      v-for="m in meals"
      :key="m.type"
      class="flex-1 py-2"
      :class="
        modelValue === m.type
          ? 'green-bg-color text-white '
          : 'lightgreen-bg-color '
      "
      @click="$emit('update:modelValue', m.type)"
    >
      {{ m.label }}
    </button>
  </div>
  <div
    class="relative p-px bg-linear-to-b from-[#79ae70] to-[#f2fde7] shadow-sm"
  ></div>
</template>

<script setup>
defineProps({ modelValue: String });
defineEmits(['update:modelValue']);

const meals = [
  { type: 'breakfast', label: '아침' },
  { type: 'lunch', label: '점심' },
  { type: 'dinner', label: '저녁' },
  { type: 'snack', label: '간식' },
  { type: 'nightSnack', label: '야식' },
];
</script>
