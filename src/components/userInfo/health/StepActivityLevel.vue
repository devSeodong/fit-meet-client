<!-- <template>
  <div class="flex flex-col items-center gap-6">
    <h3 class="text-xl font-semibold text-green-700">활동량을 선택해주세요</h3>

    <div class="grid grid-cols-2 gap-4 w-full max-w-md">
      <button
        v-for="level in levels"
        :key="level.value"
        @click="model.activity_level = level.value"
        class="p-4 rounded-xl border shadow-sm text-center transition"
        :class="
          model.activity_level === level.value
            ? 'bg-green-600 text-white'
            : 'bg-gray-100 text-gray-700'
        "
      >
        {{ level.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
const model = defineModel();

const levels = [
  { value: 'NONE', label: '거의 없음' },
  { value: 'LOW', label: '낮음' },
  { value: 'MID', label: '보통' },
  { value: 'HIGH', label: '높음' },
];
</script> -->
<template>
  <div class="flex flex-col items-center gap-6 w-full max-w-md mx-auto">
    <p class="text-2xl font-bold text-gray-700 mt-2">활동량을 선택해주세요</p>

    <div class="grid grid-cols-2 gap-4 w-full">
      <button
        v-for="level in levels"
        :key="level.value"
        @click="model.activity_level = level.value"
        class="p-4 rounded-xl border-2 text-center transition duration-200"
        :class="
          model.activity_level === level.value
            ? 'bg-green-600 text-white border-green-600 shadow-md'
            : 'bg-white text-gray-700 border-gray-200 hover:bg-green-50'
        "
      >
        <span class="block text-lg font-semibold">{{ level.label }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
const model = defineModel();

const levels = [
  { value: 'NONE', label: '거의 없음' },
  { value: 'LOW', label: '낮음' },
  { value: 'MID', label: '보통' },
  { value: 'HIGH', label: '높음' },
];
</script>
