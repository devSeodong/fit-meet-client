<template>
  <div class="flex flex-col items-center gap-6 w-full max-w-sm">
    <p class="text-2xl font-bold text-gray-700 mt-2">현재 체중(kg)</p>
    <NumberPicker
      v-model="model.weight_kg"
      :min="40"
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
