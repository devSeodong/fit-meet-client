<template>
  <div class="w-full">
    <div class="relative h-2 bg-gray-200 rounded-full overflow-hidden">
      <div
        class="h-full bg-green-600 transition-all duration-500 ease-out"
        :style="{ width: progressPercentage }"
      ></div>
    </div>

    <div class="flex justify-between text-sm mt-2 text-gray-500">
      <span>단계 {{ step }} / {{ total }}</span>
      <span class="font-medium text-green-600"
        >{{ progressPercentage }} 완료</span
      >
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  step: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
});

// 진행률을 계산하는 computed 속성
const progressPercentage = computed(() => {
  // 0으로 나누는 것을 방지
  if (props.total === 0) return '0%';
  const percent = Math.round((props.step / props.total) * 100);
  return `${percent}%`;
});
</script>
<!-- <template>
  <div class="flex gap-2 justify-center">
    <div
      v-for="i in total"
      :key="i"
      class="h-3 w-24 rounded-full transition-all"
      :class="i <= step ? 'bg-green-700' : 'bg-green-200'"
    ></div>
  </div>
</template>

<script setup>
defineProps({
  step: Number,
  total: Number,
});
</script> -->

<!-- <template>
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
</script> -->
