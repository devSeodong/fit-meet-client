<template>
  <div class="w-full flex flex-col items-center">
    <!-- 현재 값 -->
    <div class="text-4xl font-bold mb-6" :class="valueColor">
      {{ internalValue }}{{ unit }}
    </div>

    <!-- 스크롤 감싸는 영역 -->
    <div
      ref="bar"
      class="relative w-full h-20 flex items-center justify-center overflow-hidden"
      @mousedown="startDrag"
      @touchstart="startDrag"
    >
      <!-- 전체 트랙(가로선) -->
      <div
        class="absolute w-full h-1 bg-gray-300 top-1/2 -translate-y-1/2"
      ></div>

      <!-- 눈금들 -->
      <div
        v-for="(tick, i) in windowTicks"
        :key="i"
        class="absolute flex flex-col items-center"
        :style="{
          left: tick.offset + '%',
        }"
      >
        <!-- 눈금 (중앙 점점 강조) -->
        <div
          class="w-1 rounded-full transition-all"
          :style="{
            height: tick.height + 'px',
            backgroundColor: tick.color,
            opacity: tick.opacity,
          }"
        ></div>

        <!-- 숫자 표시 (중앙만 크게 보임) -->
        <div
          class="mt-2 transition-all"
          :style="{
            fontSize: tick.fontSize + 'px',
            opacity: tick.opacity,
          }"
        >
          {{ tick.value }}
        </div>
      </div>

      <!-- 드래그 핸들 -->
      <div
        class="absolute w-8 h-8 bg-blue-500 rounded-full shadow-md cursor-pointer transition active:scale-110"
        :style="{ left: '50%', transform: 'translateX(-50%)' }"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  modelValue: Number,
  min: Number,
  max: Number,
  step: Number,
  unit: { default: '' },
  valueColor: { default: 'text-blue-600' },
  windowSize: { type: Number, default: 5 }, // 양쪽 표시 범위 → 5면 중앙기준 11개 tick
});

const internalValue = ref(props.modelValue ?? props.min);
const emit = defineEmits(['update:modelValue']);

// parent 반영
watch(internalValue, v => emit('update:modelValue', v));

const bar = ref(null);

/* -----------------------------
   🔥 1) 화면에 표시될 눈금 계산
------------------------------ */
const windowTicks = computed(() => {
  const ticks = [];
  const center = internalValue.value;

  for (let i = -props.windowSize; i <= props.windowSize; i++) {
    const v = center + i * props.step;

    // 화면 밖의 값은 제거
    if (v < props.min || v > props.max) continue;

    const dist = Math.abs(i); // 중앙에서 얼마나 떨어졌나 0~N

    ticks.push({
      value: v.toFixed(1),
      offset: (i + props.windowSize) * (100 / (props.windowSize * 2)), // 화면상 위치 비율
      height: 30 - dist * 4, // 중앙이 가장 크고, 멀수록 작아짐
      opacity: 1 - dist * 0.1, // 멀수록 흐려짐
      color: dist === 0 ? '#2563eb' : '#9ca3af', // 중앙은 파랑
      fontSize: dist === 0 ? 18 : 12, // 중앙만 크게
    });
  }
  return ticks;
});

/* -----------------------------
   🔥 2) 드래그로 값 조절
------------------------------ */
let dragging = false;

const startDrag = e => {
  dragging = true;
  move(e);
  window.addEventListener('mousemove', move);
  window.addEventListener('mouseup', stop);
  window.addEventListener('touchmove', move);
  window.addEventListener('touchend', stop);
};

const stop = () => {
  dragging = false;
  window.removeEventListener('mousemove', move);
  window.removeEventListener('mouseup', stop);
  window.removeEventListener('touchmove', move);
  window.removeEventListener('touchend', stop);
};

const move = e => {
  if (!dragging) return;

  const rect = bar.value.getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const percent = (clientX - rect.left) / rect.width;

  // percent 0~1 → 값으로 변환
  const newValue = props.min + percent * (props.max - props.min);

  // 스텝 반영
  const stepped = Math.round(newValue / props.step) * props.step;

  internalValue.value = Math.min(props.max, Math.max(props.min, stepped));
};
</script>
