<template>
  <div>
    <h2 class="text-xl font-semibold mb-6">키</h2>

    <div class="mb-6 text-center text-3xl font-bold text-blue-600">
      {{ model.height_cm ?? 0 }} cm
    </div>

    <input
      type="range"
      min="120"
      max="210"
      step="0.1"
      v-model="model.height_cm"
      class="w-full"
    />

    <div class="mt-4 flex justify-between text-sm text-gray-500">
      <span>120cm</span>
      <span>210cm</span>
    </div>

    <input
      type="number"
      v-model="model.height_cm"
      step="0.1"
      class="mt-6 w-full px-4 py-2 border rounded-lg"
      placeholder="직접 입력"
    />
  </div>
</template>

<script setup>
const model = defineModel();
</script>
