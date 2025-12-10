<template>
  <div class="w-full">
    <!-- 현재 값 -->
    <div class="text-center text-3xl font-bold mb-4" :class="valueColor">
      {{ displayValue }}
    </div>

    <!-- 전체 바 -->
    <div
      ref="bar"
      class="relative w-full h-10 flex items-center"
      @mousedown="startDrag"
      @touchstart="startDrag"
    >
      <!-- 트랙 -->
      <div class="absolute w-full h-1 bg-gray-300 rounded"></div>

      <!-- 눈금 -->
      <div
        v-for="(t, i) in ticks"
        :key="i"
        class="absolute w-0.5 bg-gray-400"
        :style="{
          height: i % majorEvery === 0 ? '14px' : '8px',
          left: t + '%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }"
      ></div>

      <!-- 핸들 -->
      <div
        class="absolute w-6 h-6 bg-blue-500 rounded-full shadow cursor-pointer active:scale-110 transition"
        :style="{ left: handleLeft + '%' }"
      ></div>
    </div>

    <!-- 직접입력 -->
    <input
      type="number"
      :step="step"
      v-model="internalValue"
      class="mt-6 w-full px-4 py-2 border rounded-lg"
    />
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue';

const props = defineProps({
  modelValue: Number,
  min: Number,
  max: Number,
  step: Number,
  unit: { type: String, default: '' },
  valueColor: { type: String, default: 'text-blue-600' },
});

// 내부 값
const internalValue = ref(props.modelValue ?? props.min);
const bar = ref(null);

// 눈금 계산
const totalSteps = computed(() => (props.max - props.min) / props.step);
const ticks = computed(() => {
  return Array.from(
    { length: totalSteps.value + 1 },
    (_, i) => (i / totalSteps.value) * 100,
  );
});

// 굵은 눈금 간격
const majorEvery = 5;

// 핸들 위치 %
const handleLeft = computed(() => {
  return ((internalValue.value - props.min) / (props.max - props.min)) * 100;
});

const displayValue = computed(() => `${internalValue.value}${props.unit}`);

// 부모 emit
const emit = defineEmits(['update:modelValue']);

watch(internalValue, v => {
  emit('update:modelValue', Number(v));
});

// 드래그 로직
let dragging = false;

const startDrag = e => {
  dragging = true;
  move(e);

  window.addEventListener('mousemove', move);
  window.addEventListener('mouseup', stop);
  window.addEventListener('touchmove', move);
  window.addEventListener('touchend', stop);
};

const move = e => {
  if (!dragging) return;

  const rect = bar.value.getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  let pos =
    ((clientX - rect.left) / rect.width) * (props.max - props.min) + props.min;

  // 보정
  pos = Math.max(props.min, Math.min(props.max, pos));

  // 스텝 반영
  const stepped = Math.round(pos / props.step) * props.step;
  internalValue.value = stepped;
};

const stop = () => {
  dragging = false;
  window.removeEventListener('mousemove', move);
  window.removeEventListener('mouseup', stop);
  window.removeEventListener('touchmove', move);
  window.removeEventListener('touchend', stop);
};
</script>
