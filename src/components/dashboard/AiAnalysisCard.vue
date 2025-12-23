<template>
  <div
    class="p-6 rounded-xl shadow-lg flex flex-col justify-center gap-2 items-center text-center transition-all duration-500"
    :class="dashboardStore.loading ? 'animate-pulse' : ''"
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
      <SparklesIcon
        class="w-8 h-8 text-amber-300"
        :class="{ 'animate-spin': dashboardStore.loading }"
      />
    </div>

    <div class="text-gray-800">
      <h3 class="text-xl font-extrabold mb-1">
        <span class="text-blue-600">AI</span> 맞춤 분석
      </h3>
      <p class="text-sm opacity-80 mb-3">
        {{
          dashboardStore.loading
            ? "AI가 식단을 정밀 분석 중입니다..."
            : "이번 주 식단을 AI가 분석해 드립니다."
        }}
      </p>
    </div>

    <button
      @click="handleAnalysis"
      :disabled="dashboardStore.loading"
      class="bg-white/80 font-bold py-2 px-4 rounded-full w-full hover:bg-white cursor-pointer transition duration-200 shadow-md disabled:cursor-not-allowed disabled:opacity-50"
    >
      <span v-if="!dashboardStore.loading">분석 시작</span>
      <span v-else class="flex items-center justify-center gap-2">
        <svg class="animate-spin h-4 w-4 text-blue-600" viewBox="0 0 24 24">
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        분석 중...
      </span>
    </button>
  </div>
</template>

<script setup>
import { SparklesIcon } from "@heroicons/vue/24/solid";
import { useDashboardStore } from "@/stores/Dashboard";

const dashboardStore = useDashboardStore();
const emit = defineEmits(["analysis-complete"]);

const handleAnalysis = async () => {
  try {
    const result = await dashboardStore.fetchAiWeeklyAnalysis();
    if (result) {
      emit("analysis-complete", result);
    }
  } catch (err) {
    alert("분석 중 오류가 발생했습니다.");
  }
};
</script>
