<template>
  <div class="w-full flex flex-col mb-6">
    <div class="flex justify-between mb-2 text-sm font-medium text-gray-600">
      <span>Step {{ step }} / {{ total }}</span>
    </div>

    <div class="w-full h-2 bg-gray-200 rounded-full">
      <div
        class="h-2 bg-blue-600 rounded-full transition-all"
        :style="{ width: (step / total) * 100 + '%' }"
      ></div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  step: Number,
  total: Number,
});
</script>
