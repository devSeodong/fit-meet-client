<!-- <template>
  <div class="flex flex-col items-center gap-4">
    <h3 class="text-xl font-semibold text-green-700">키를 선택해주세요</h3>
    <NumberPicker
      v-model="model.height_cm"
      :min="130"
      :max="200"
      :step="0.5"
      unit="cm"
      :defaultValue="165"
    />
  </div>
</template>

<script setup>
import NumberPicker from '@/components/common/NumberPicker.vue';
const model = defineModel();
</script> -->
<template>
  <div class="flex flex-col items-center gap-6 w-full max-w-sm">
    <p class="text-2xl font-bold text-gray-700 mt-2">키 (Height)</p>
    <NumberPicker
      v-model="model.height_cm"
      :min="130"
      :max="200"
      :step="0.5"
      unit="cm"
      :defaultValue="165"
    />
  </div>
</template>

<script setup>
import NumberPicker from '@/components/common/NumberPicker.vue';
const model = defineModel();
</script>
