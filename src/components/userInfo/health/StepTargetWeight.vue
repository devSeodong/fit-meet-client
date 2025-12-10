<template>
  <!-- <div class="flex flex-col items-center gap-4">
    <h3 class="text-xl font-semibold text-green-700">
      목표 몸무게를 선택해주세요
    </h3> -->
  <div class="flex flex-col items-center gap-6 w-full max-w-sm">
    <p class="text-2xl font-bold text-gray-700 mt-2">목표 몸무게</p>
    <NumberPicker
      v-model="model.target_weight_kg"
      :min="30"
      :max="150"
      :step="0.5"
      unit="kg"
      :defaultValue="60"
    />
  </div>
</template>

<script setup>
import NumberPicker from '@/components/common/NumberPicker.vue';
const model = defineModel();
</script>
