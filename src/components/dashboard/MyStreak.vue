<template>
  <div
    class="bg-white p-6 rounded-xl shadow-lg border border-gray-50 relative overflow-hidden"
  >
    <!-- rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] -->
    <div
      class="absolute -top-10 -right-10 w-32 h-32 bg-lime-100 rounded-full blur-3xl opacity-50"
    ></div>

    <div class="relative">
      <div class="flex items-center gap-3 mb-2.5 -mt-2">
        <div
          class="text-6xl font-black text-lime-500 leading-none tracking-tighter pb-0.5"
        >
          {{ store.streakData.streakCount }}
        </div>
        <div class="flex flex-col">
          <span class="text-lg font-bold text-gray-700">일 연속 기록 중!</span>
          <span
            class="text-[10px] font-semibold text-lime-600 bg-lime-50 px-2 py-1 rounded-md self-start"
          >
            목표 달성까지 파이팅!
          </span>
        </div>
      </div>

      <div class="p-5 bg-gray-50/50 rounded-2xl border border-gray-100">
        <div class="grid grid-cols-7 gap-2 mb-3">
          <span
            v-for="day in ['일', '월', '화', '수', '목', '금', '토']"
            :key="day"
            class="text-[10px] font-bold text-gray-400 text-center uppercase"
          >
            {{ day }}
          </span>
        </div>

        <div class="grid grid-cols-7 gap-2">
          <div
            v-for="(day, idx) in store.activityDays"
            :key="idx"
            class="relative group aspect-square"
          >
            <div
              :class="[
                'w-full h-full rounded-md transition-all duration-300 cursor-help border-2 cursor-pointer',
                day.dietLogged
                  ? 'bg-lime-400 border-lime-400 shadow-[0_0_12px_rgba(163,230,53,0.4)] scale-100 group-hover:scale-110'
                  : 'bg-gray-200 border-gray-200 group-hover:bg-gray-300',
                isToday(day.date)
                  ? 'border-orange-400 ring-2 ring-orange-100'
                  : 'border-transparent',
                isOtherMonth(day.date) ? 'opacity-20' : 'opacity-100',
              ]"
              @click="gotoCalender"
            ></div>

            <div
              class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 bg-gray-800 text-white text-[10px] rounded pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-xl"
            >
              <span class="font-bold">{{ day.date }}</span>
              <span v-if="isToday(day.date)" class="ml-1 text-orange-300"
                >[오늘]</span
              >
              <span class="ml-1 text-gray-300"
                >| {{ day.dietLogged ? "기록 완료" : "미기록" }}</span
              >
              <div
                class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <BadgeCollection :streakCount="store.streakData.streakCount" />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useDashboardStore } from "@/stores/Dashboard";
import BadgeCollection from "./BadgeCollection.vue";
import { useRouter } from "vue-router";
const router = useRouter();

const store = useDashboardStore();

// 날짜 비교 유틸리티
const isToday = (dateStr) => {
  const target = new Date(dateStr).toDateString();
  const today = new Date().toDateString();
  return target === today;
};

const isOtherMonth = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  return date.getMonth() !== now.getMonth();
};

const gotoCalender = () => {
  router.push("/diet?view=month");
};

onMounted(() => {
  store.fetchStreakAndActivity();
});
</script>
