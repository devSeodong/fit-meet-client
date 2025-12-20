<template>
  <div
    v-if="type === 'kcal'"
    class="flex items-center justify-between p-4 rounded-xl shadow-sm"
  >
    <div class="flex flex-col">
      <span class="text-xs font-bold text-kcal mb-1 uppercase">{{
        title
      }}</span>
      <div class="text-2xl font-black text-gray-800">
        {{ consumed }}
        <span class="text-sm font-normal text-gray-400"
          >/ {{ goal }} {{ unit }}</span
        >
      </div>
    </div>
    <div v-if="isExceeded" class="bg-white p-2 rounded-full shadow-sm">
      <ExclamationTriangleIcon class="w-6 h-6 text-red-500 animate-pulse" />
    </div>
  </div>

  <div
    v-else
    class="flex flex-col gap-1.5 p-3 bg-gray-50 rounded-lg border border-gray-100"
  >
    <div class="flex justify-between items-center text-[11px]">
      <span class="font-bold text-gray-600">{{ title }}</span>
      <span class="font-medium text-gray-400"
        >{{ consumed }}{{ unit }} / {{ goal }}{{ unit }}</span
      >
    </div>
    <div
      class="h-2 w-full bg-white rounded-full overflow-hidden shadow-inner progress-inner-shadow"
    >
      <div
        :class="[
          'h-full rounded-full transition-all duration-700',
          barColorClass,
        ]"
        :style="{ width: `${Math.min(progressPercent, 100)}%` }"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { ExclamationTriangleIcon } from '@heroicons/vue/24/solid';

const props = defineProps({
  type: String,
  title: String,
  consumed: Number,
  goal: Number,
  unit: String,
});

// 진행률 계산
const progressPercent = computed(() => (props.consumed / props.goal) * 100);

// 초과 여부
const isExceeded = computed(() => props.consumed > props.goal);

// 타입별 바 색상 클래스
const barColorClass = computed(() => {
  if (isExceeded.value && props.type !== 'kcal') return 'bg-red-500';
  switch (props.type) {
    case 'carb':
      return 'bg-carb';
    case 'protein':
      return 'bg-protein';
    case 'fat':
      return 'bg-fat';
    default:
      return 'bg-kcal';
  }
});
</script>

<style scoped>
.progress-inner-shadow {
  box-shadow: inset 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}
</style>
