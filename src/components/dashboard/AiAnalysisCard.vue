<template>
  <div
    class="h-62.5 p-6 rounded-xl shadow-lg flex flex-col justify-center gap-2 items-center text-center"
    style="
      background: linear-gradient(
        135deg,
        #f7fafc 0%,
        #e0f2fe 30%,
        #fef3c7 70%,
        #d1fae5 100%
      );
      color: #1f2937;
    "
  >
    <div class="mb-3">
      <SparklesIcon class="w-8 h-8 text-amber-300" />
    </div>

    <div class="text-gray-800">
      <h3 class="text-xl font-extrabold mb-1">
        <span class="text-blue-600">AI</span> 맞춤 분석
      </h3>
      <p class="text-sm opacity-80 mb-4">
        이번 주 식단을 AI가 분석해 드립니다.
      </p>
    </div>

    <button
      class="bg-white/80 font-bold py-2 px-4 rounded-full w-full hover:bg-white cursor-pointer transition duration-200 shadow-md hover:shadow-amber-200"
      @click="$emit('analyze')"
    >
      분석 시작
    </button>
  </div>
</template>

<script setup>
import { SparklesIcon } from '@heroicons/vue/24/solid';
</script>
