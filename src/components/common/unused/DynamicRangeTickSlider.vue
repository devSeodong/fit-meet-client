<template>
  <div class="w-full">
    <!-- 현재 값 -->
    <div class="text-center text-3xl font-bold mb-5" :class="valueColor">
      {{ displayValue }}{{ unit }}
    </div>

    <!-- 드래그 영역 -->
    <div
      ref="bar"
      class="relative w-full h-20 flex items-center justify-center overflow-hidden select-none touch-none"
      @pointerdown="onPointerDown"
    >
      <div class="absolute left-0 right-0 h-0.5 bg-gray-200"></div>

      <!-- 중앙 가이드 -->
      <div
        class="absolute left-1/2 -translate-x-1/2 h-8 w-0.5 bg-gray-400 rounded"
      ></div>

      <!-- 눈금 -->
      <div
        v-for="tick in ticks"
        :key="tick.key"
        class="absolute flex flex-col items-center"
        :style="{ left: tick.left }"
      >
        <div
          class="rounded-full transition-all duration-100"
          :style="{
            width: tick.isCenter ? '3px' : '2px',
            height: tick.height + 'px',
            backgroundColor: tick.color,
            opacity: tick.opacity,
          }"
        ></div>

        <div
          class="mt-2 transition-all duration-100"
          :style="{
            fontSize: tick.fontSize + 'px',
            opacity: tick.opacity,
            color: tick.color,
          }"
        >
          {{ tick.label }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  modelValue: [Number, String],
  min: Number,
  max: Number,
  step: Number,
  unit: String,
  valueColor: String,
  windowSize: { type: Number, default: 5 },
});

const emit = defineEmits(['update:modelValue']);

const decimalsFromStep = step => {
  const s = String(step);
  const idx = s.indexOf('.');
  return idx === -1 ? 0 : s.length - idx - 1;
};

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

const roundToStep = value => {
  const d = decimalsFromStep(props.step);
  const rounded = Math.round(value / props.step) * props.step;
  return Number(rounded.toFixed(d));
};

const internal = ref(
  roundToStep(
    clamp(Number(props.modelValue ?? props.min), props.min, props.max),
  ),
);

watch(
  () => props.modelValue,
  v => {
    internal.value = roundToStep(
      clamp(Number(v ?? props.min), props.min, props.max),
    );
  },
);

watch(internal, v => emit('update:modelValue', v));

const safeWindow = computed(() =>
  Math.min(
    props.windowSize,
    Math.floor((props.max - props.min) / (2 * props.step)),
  ),
);

const effectiveCenter = computed(() => {
  const w = safeWindow.value;
  const minC = props.min + w * props.step;
  const maxC = props.max - w * props.step;
  return clamp(internal.value, minC, maxC);
});

const displayValue = computed(() =>
  internal.value.toFixed(decimalsFromStep(props.step)),
);

const ticks = computed(() => {
  const w = safeWindow.value;
  const center = effectiveCenter.value;
  const per = 100 / (2 * w);

  const list = [];
  for (let i = -w; i <= w; i++) {
    const value = roundToStep(center + i * props.step);
    const dist = Math.abs(i);
    const t = 1 - dist / (w || 1);

    list.push({
      key: `${value}-${i}`,
      label: value.toFixed(decimalsFromStep(props.step)),
      left: `${50 + i * per}%`,
      isCenter: dist === 0,
      height: 26 * (0.55 + 0.45 * t),
      fontSize: dist === 0 ? 18 : 12,
      opacity: 0.35 + 0.65 * t,
      color: dist === 0 ? '#2563eb' : '#9ca3af',
    });
  }
  return list;
});

/* --------------------------
    포인터 드래그 이벤트
-------------------------- */

const bar = ref(null);
const drag = ref(null);

const onPointerDown = e => {
  if (!bar.value) return;

  const rect = bar.value.getBoundingClientRect();

  drag.value = {
    startX: e.clientX,
    startValue: internal.value,
    width: rect.width,
  };

  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', endDrag);
};

const onPointerMove = e => {
  if (!drag.value) return;

  const dx = e.clientX - drag.value.startX;
  const delta = (dx / drag.value.width) * (props.max - props.min);

  internal.value = roundToStep(
    clamp(drag.value.startValue + delta, props.min, props.max),
  );
};

const endDrag = () => {
  drag.value = null;
  window.removeEventListener('pointermove', onPointerMove);
  window.removeEventListener('pointerup', endDrag);
};

onUnmounted(() => {
  window.removeEventListener('pointermove', onPointerMove);
  window.removeEventListener('pointerup', endDrag);
});
</script>
