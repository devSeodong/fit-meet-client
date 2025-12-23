<template>
  <div class="mt-4 pt-4 border-t border-gray-100">
    <div class="flex items-center justify-between mb-4">
      <p
        class="text-[12px] font-bold text-white tracking-widest bg-amber-400 border border-amber-500 rounded-lg px-2 py-1 inline-block uppercase"
      >
        이달의 배지 현황
      </p>
      <span class="text-[10px] text-gray-400 font-medium">
        목표 달성: {{ earnedBadges }} / {{ totalSlots }}
      </span>
    </div>

    <div class="flex flex-wrap gap-4">
      <div
        v-for="n in totalSlots"
        :key="n"
        class="group relative flex items-center justify-center w-11 h-11 transition-all duration-500"
      >
        <div
          v-if="n <= earnedBadges"
          class="flex items-center justify-center w-full h-full bg-gradient-to-br from-yellow-50 to-orange-100 rounded-2xl shadow-sm border border-yellow-200 animate-in fade-in zoom-in duration-300"
        >
          <TrophyIcon class="w-6 h-6 text-yellow-500 drop-shadow-sm" />
          <div
            class="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center border border-yellow-200 shadow-sm"
          >
            <span class="text-[8px] font-black text-yellow-600">{{
              n * 7
            }}</span>
          </div>
        </div>

        <div
          v-else
          class="flex items-center justify-center w-full h-full bg-gray-50/30 rounded-2xl border-2 border-dashed border-gray-100 transition-colors group-hover:border-gray-200"
        >
          <StarIcon class="w-5 h-5 text-gray-200 group-hover:text-gray-300" />
          <div
            class="absolute -bottom-1 -right-1 w-4 h-4 bg-gray-50 rounded-full flex items-center justify-center border border-gray-200"
          >
            <span class="text-[8px] font-bold text-gray-300">{{ n * 7 }}</span>
          </div>
        </div>

        <div
          class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 bg-gray-800 text-white text-[9px] rounded opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none"
        >
          {{ n * 7 }}일 연속 달성 기록
          <div
            class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { TrophyIcon, StarIcon } from "@heroicons/vue/24/solid";

const props = defineProps({
  streakCount: { type: Number, default: 0 },
});

// 1. 이번 달 총 일수를 기반으로 만들 수 있는 최대 배지 개수 (예: 31일이면 4개)
const totalSlots = computed(() => {
  const now = new Date();
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  return Math.floor(lastDay / 7); // 28~31일이므로 보통 4개가 나옵니다.
});

// 2. 현재 스트릭으로 획득한 배지 개수
const earnedBadges = computed(() => Math.floor(props.streakCount / 7));
</script>
