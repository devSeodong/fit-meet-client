<template>
  <div
    class="relative w-full h-40 flex flex-col items-center justify-center select-none cursor-grab active:cursor-grabbing bg-gray-50 rounded-xl"
    @mousedown="startDrag"
    @touchstart="startDrag"
    @mousemove="onDrag"
    @mouseup="endDrag"
    @mouseleave="endDragHover"
    @touchmove="onDrag"
    @touchend="endDrag"
    @wheel.prevent="onWheel"
    @mouseenter="hovered = true"
    ref="pickerContainer"
    style="touch-action: none"
  >
    <div
      class="absolute inset-y-0 flex flex-col justify-center w-full px-4 pointer-events-none"
    >
      <div class="h-10 border-y-2 border-green-500/50 rounded-md"></div>
    </div>

    <div
      class="flex items-center justify-center transition-all duration-200 ease-out h-10"
      :class="
        prevValue !== ''
          ? 'text-gray-400 text-lg opacity-70 scale-95'
          : 'text-transparent opacity-0'
      "
    >
      {{ prevValue }}{{ unit }}
    </div>

    <div
      class="flex items-center justify-center transition-all duration-200 ease-out h-10 font-extrabold text-3xl text-green-700 scale-110"
    >
      {{ modelValue }}{{ unit }}
    </div>

    <div
      class="flex items-center justify-center transition-all duration-200 ease-out h-10"
      :class="
        nextValue !== ''
          ? 'text-gray-400 text-lg opacity-70 scale-95'
          : 'text-transparent opacity-0'
      "
    >
      {{ nextValue }}{{ unit }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  modelValue: Number,
  min: Number,
  max: Number,
  step: { type: Number, default: 0.5 },
  unit: { type: String, default: '' },
  defaultValue: { type: Number, default: null },
});
const emit = defineEmits(['update:modelValue']);

// ------------------------------
// 상태 관리
// ------------------------------
let dragging = false;
let startY = 0;
const hovered = ref(false);
const pickerContainer = ref(null);

// 초기값 설정
// if (props.defaultValue !== null && props.modelValue === undefined) {
//   emit('update:modelValue', props.defaultValue);
// }
if (
  props.defaultValue !== null &&
  (props.modelValue === undefined || props.modelValue === null)
) {
  emit('update:modelValue', props.defaultValue);
}

// ------------------------------
// 드래그 로직 (스크롤 방지 강화)
// ------------------------------
function startDrag(e) {
  // 데스크톱 드래그 시작 시 이벤트 버블링 방지
  if (e.type === 'mousedown') {
    e.preventDefault();
  }

  dragging = true;
  startY = e.touches ? e.touches[0].clientY : e.clientY;
}

function onDrag(e) {
  if (!dragging) return;
  // 터치 이벤트 발생 시 전체 스크롤 방지
  if (e.type === 'touchmove') {
    e.preventDefault();
  }

  const y = e.touches ? e.touches[0].clientY : e.clientY;
  const delta = startY - y;
  const stepTrigger = 20; // 한 단계 이동 픽셀 (민감도 증가)

  if (Math.abs(delta) >= stepTrigger) {
    const dir = delta > 0 ? 1 : -1; // 위로 드래그(delta > 0) = 값 증가(dir = 1)
    updateValue(dir);
    startY = y;
  }
}

function endDrag() {
  dragging = false;
}

function endDragHover() {
  endDrag();
  hovered.value = false;
}

// ------------------------------
// 휠 스크롤
// ------------------------------
function onWheel(e) {
  // @wheel.prevent 가 템플릿에 있지만, 로직에서도 다시 확인
  if (!hovered.value) return;
  const dir = e.deltaY > 0 ? 1 : -1;
  updateValue(dir);
}

// ------------------------------
// 숫자 업데이트
// ------------------------------
function updateValue(dir) {
  let newValue = Number((props.modelValue + props.step * dir).toFixed(2));
  if (newValue > props.max) newValue = props.max;
  if (newValue < props.min) newValue = props.min;
  emit('update:modelValue', newValue);
}

// ------------------------------
// 위/중앙/아래 숫자 계산
// ------------------------------
const prevValue = computed(() => {
  const v = Number((props.modelValue - props.step).toFixed(2));
  return v < props.min ? '' : v;
});
const nextValue = computed(() => {
  const v = Number((props.modelValue + props.step).toFixed(2));
  return v > props.max ? '' : v;
});
</script>
