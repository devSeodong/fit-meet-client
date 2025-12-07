<template>
  <div>
    <h2 class="text-xl font-semibold mb-6">현재 몸무게</h2>

    <div class="mb-6 text-center text-3xl font-bold text-blue-600">
      {{ model.weight_kg ?? 0 }} kg
    </div>

    <input
      type="range"
      min="30"
      max="200"
      step="0.1"
      v-model="model.weight_kg"
      class="w-full"
    />

    <input
      type="number"
      step="0.1"
      placeholder="직접 입력"
      class="mt-6 w-full px-4 py-2 border rounded-lg"
      v-model="model.weight_kg"
    />
  </div>
</template>

<script setup>
const model = defineModel();
</script>
