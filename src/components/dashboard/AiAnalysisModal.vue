<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
  >
    <div
      class="bg-white w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
    >
      <div
        class="p-6 border-b border-gray-100 shadow-lg flex justify-between items-center bg-gray-50"
      >
        <div class="flex items-center gap-2">
          <SparklesIcon class="w-6 h-6 text-amber-400" />
          <h2 class="text-xl font-bold text-gray-800">주간 건강 분석 보고서</h2>
        </div>
        <button
          @click="$emit('close')"
          class="text-gray-400 cursor-pointer hover:text-gray-600 text-2xl"
        >
          &times;
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-6 space-y-8">
        <section>
          <div class="bg-blue-50 p-4 rounded-xl border border-blue-100">
            <p class="text-blue-900 leading-relaxed text-sm italic font-medium">
              " {{ data.analysis.summary }} "
            </p>
          </div>
        </section>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-green-50 p-4 rounded-xl border border-green-100">
            <h4 class="text-green-700 font-bold mb-2 flex items-center gap-1">
              ✅ 강점
            </h4>
            <ul class="text-xs space-y-1.5 text-green-800">
              <li v-for="s in data.analysis.strengths" :key="s">• {{ s }}</li>
            </ul>
          </div>
          <div class="bg-red-50 p-4 rounded-xl border border-red-100">
            <h4 class="text-red-700 font-bold mb-2 flex items-center gap-1">
              ⚠️ 개선점
            </h4>
            <ul class="text-xs space-y-1.5 text-red-800">
              <li v-for="w in data.analysis.weaknesses" :key="w">• {{ w }}</li>
            </ul>
          </div>
        </div>

        <section class="space-y-3">
          <h4 class="font-bold text-gray-800 flex items-center gap-2">
            🥗 식단 추천 가이드
          </h4>
          <div class="grid grid-cols-1 gap-3">
            <div class="text-sm">
              <span class="font-bold text-blue-600">[집중할 점]</span>
              <p class="text-gray-600 text-xs mt-1">
                {{ data.analysis.dietRecommendations.focusPoints.join(', ') }}
              </p>
            </div>
            <div class="text-sm">
              <span class="font-bold text-green-600">[추천 식품]</span>
              <p class="text-gray-600 text-xs mt-1">
                {{
                  data.analysis.dietRecommendations.recommendedFoods.join(', ')
                }}
              </p>
            </div>
          </div>
        </section>

        <section class="bg-gray-800 text-white p-5 rounded-xl">
          <h4 class="font-bold mb-4 flex items-center gap-2">
            🏃 추천 운동 플랜
          </h4>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between border-b border-gray-700 pb-2">
              <span class="text-gray-400">유산소</span>
              <span>{{ data.analysis.exerciseRecommendations.cardio }}</span>
            </div>
            <div class="flex justify-between border-b border-gray-700 pb-2">
              <span class="text-gray-400">근력</span>
              <span>{{ data.analysis.exerciseRecommendations.strength }}</span>
            </div>
            <div class="pt-2 text-amber-300 font-medium">
              🗓 {{ data.analysis.exerciseRecommendations.weeklyPlan }}
            </div>
          </div>
        </section>
      </div>

      <div
        class="p-4 bg-gray-50 border-t border-gray-100 inset-shadow-sm text-center"
      >
        <button
          @click="$emit('close')"
          class="bg-[#8A8F6E] text-white px-8 py-2 rounded-lg font-bold cursor-pointer"
        >
          확인
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { SparklesIcon } from '@heroicons/vue/24/solid';
defineProps({ isVisible: Boolean, data: Object });
defineEmits(['close']);
</script>
