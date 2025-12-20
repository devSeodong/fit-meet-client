<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-opacity-20 transition-opacity"
    @click.self="closeModal"
  >
    <div
      class="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm transform transition-all"
    >
      <h3 class="text-xl font-bold text-gray-800 text-center mb-6">
        식단 등록 옵션 선택
      </h3>

      <div class="space-y-4">
        <button
          @click="selectOption('image')"
          class="w-full flex items-center justify-center p-4 cursor-pointer bg-linear-to-r from-[#91bdaa] via-[#7aaab3] to-[#6da2c3] text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98]"
        >
          <SparklesIcon class="w-6 h-6 mr-3 text-white animate-pulse" />
          <span>AI 이미지로 분석하기</span>
        </button>

        <button
          @click="selectOption('public-api')"
          class="w-full flex items-center justify-center p-4 cursor-pointer bg-[#7d92b0] text-white font-semibold rounded-xl hover:bg-[#667fa2] transition-colors shadow-md"
        >
          <MagnifyingGlassIcon class="w-6 h-6 mr-3" />
          <span>음식 검색으로 추가</span>
        </button>

        <button
          @click="selectOption('manual')"
          class="w-full flex items-center justify-center p-4 cursor-pointer bg-[#eaeef4] text-slate-600 font-semibold rounded-xl hover:bg-slate-200 transition-colors border border-slate-200 shadow-sm"
        >
          <PencilSquareIcon class="w-6 h-6 mr-3 text-slate-400" />
          <span>식단 직접 입력</span>
        </button>
      </div>

      <div class="mt-6 text-center">
        <button
          @click="closeModal"
          class="text-sm text-gray-500 hover:text-gray-700 underline"
        >
          취소
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  PencilSquareIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
} from '@heroicons/vue/24/outline';
import { defineProps, defineEmits } from 'vue';

// Props모달의 가시성 제어
const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true,
  },
});

// Emits로 부모 컴포넌트에 상태 변경 및 옵션 선택 전달
const emit = defineEmits(['update:isVisible', 'selectOption']);

const closeModal = () => {
  emit('update:isVisible', false);
};

/**
 * 옵션을 선택하고 부모 컴포넌트에 옵션 타입과 함께 모달 닫힘을 알립니다.
 * @param {string} optionType - 'direct' 또는 'search'
 */
const selectOption = optionType => {
  emit('selectOption', optionType);
  closeModal();
};
</script>

<style scoped></style>
