<template>
  <div class="w-full px-2">
    <!-- 현재 값 표시 -->
    <div class="text-center text-3xl font-bold mb-4" :class="valueColor">
      {{ internalValue }} {{ unit }}
    </div>

    <!-- 슬라이더 -->
    <div class="relative w-full">
      <input
        type="range"
        :min="min"
        :max="max"
        :step="step"
        v-model="internalValue"
        class="w-full appearance-none bg-gray-300 h-2 rounded-lg cursor-pointer"
      />

      <!-- 눈금(Ticks) -->
      <div
        class="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none"
      >
        <span
          v-for="tick in tickCount"
          :key="tick"
          class="w-0.5 h-3 bg-gray-400"
        ></span>
      </div>
    </div>

    <!-- min ~ max 표시 -->
    <div class="flex justify-between mt-3 text-sm text-gray-500">
      <span>{{ min }}{{ unit }}</span>
      <span>{{ max }}{{ unit }}</span>
    </div>

    <!-- 직접 입력 -->
    <input
      type="number"
      :step="step"
      v-model="internalValue"
      class="mt-6 w-full px-4 py-2 border rounded-lg"
      :placeholder="placeholder"
    />
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
  modelValue: Number,
  min: { type: Number, default: 0 },
  max: { type: Number, default: 100 },
  step: { type: Number, default: 1 },
  unit: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  valueColor: { type: String, default: 'text-blue-600' },
});

// 내부 값
const internalValue = ref(props.modelValue);

// 눈금 개수 계산
const tickCount = computed(() => {
  return Math.floor((props.max - props.min) / props.step);
});

// emit
const emit = defineEmits(['update:modelValue']);

// props 업데이트 → 내부 반영
watch(
  () => props.modelValue,
  val => (internalValue.value = val),
);

// 내부 값 → 부모 emit
watch(internalValue, val => {
  emit('update:modelValue', Number(val));
});
</script>

<style scoped>
/* 모바일 슬라이더 터치 영역 개선 */
input[type='range'] {
  -webkit-tap-highlight-color: transparent;
}
</style>
