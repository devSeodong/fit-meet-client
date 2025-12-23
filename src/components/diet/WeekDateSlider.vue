<template>
  <div class="flex items-center gap-2 mb-4">
    <button
      @click="prev"
      class="cursor-pointer p-1 hover:bg-gray-100 rounded-full transition"
    >
      <ChevronDoubleLeftIcon class="w-5 h-5" />
    </button>

    <div class="grid grid-cols-7 gap-1 flex-1 text-center">
      <div
        v-for="(item, index) in visibleDates"
        :key="item.date.toDateString()"
        @click="$emit('select', item.date)"
        :class="[
          'relative p-2 rounded  cursor-pointer transition flex flex-col items-center justify-center min-h-[60px]',
          isSelected(item.date)
            ? 'green-bg-color text-white shadow-md'
            : item.isCurrentMonth
            ? 'hover:bg-[#f0f4e8]'
            : 'opacity-40',
        ]"
      >
        <div
          :class="[
            'text-[14px] mb-1',
            index % 7 === 0
              ? item.isCurrentMonth
                ? 'text-red-500'
                : 'text-red-300'
              : isSelected(item.date)
              ? 'text-white'
              : 'text-gray-500',
          ]"
        >
          {{ labels[item.date.getDay()] }}
        </div>

        <div
          :class="[
            'font-bold text-lg leading-none',
            index % 7 === 0
              ? item.isCurrentMonth
                ? 'text-red-500'
                : 'text-red-300'
              : '',
          ]"
        >
          {{ item.date.getDate() }}
        </div>

        <div class="h-2 flex items-center justify-center mt-1">
          <div
            v-if="hasDiet(item.date)"
            class="w-1.5 h-1.5 rounded-full transition-all duration-300"
            :style="{
              backgroundColor: isSelected(item.date) ? '#ffffff' : '#79ae70',
            }"
          ></div>
          <div v-else class="w-1.5 h-1.5"></div>
        </div>
      </div>
    </div>

    <button
      @click="next"
      class="cursor-pointer p-1 hover:bg-gray-100 rounded-full transition"
    >
      <ChevronDoubleRightIcon class="w-5 h-5" />
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/vue/24/outline";
import { useDietStore } from "@/stores/Diet";
import { storeToRefs } from "pinia";

const props = defineProps({
  baseMonth: Date,
  selectedDate: Date,
});

const emit = defineEmits(["select"]);
const dietStore = useDietStore();
const { dailyDietMap } = storeToRefs(dietStore);

const labels = ["일", "월", "화", "수", "목", "금", "토"];
const page = ref(0);

//날짜별 식단 존재 여부 확인
const hasDiet = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const dateStr = `${y}-${m}-${d}`;
  return dailyDietMap.value[dateStr] && dailyDietMap.value[dateStr].length > 0;
};

// 날짜 슬라이더 설정
const allDates = computed(() => {
  const y = props.baseMonth.getFullYear();
  const m = props.baseMonth.getMonth();
  const firstDay = new Date(y, m, 1).getDay();
  const lastDate = new Date(y, m + 1, 0).getDate();
  const prevLastDate = new Date(y, m, 0).getDate();
  const days = [];
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({
      date: new Date(y, m - 1, prevLastDate - i),
      isCurrentMonth: false,
    });
  }
  for (let d = 1; d <= lastDate; d++) {
    days.push({ date: new Date(y, m, d), isCurrentMonth: true });
  }
  while (days.length % 7 !== 0) {
    const nextDay = days.length - (firstDay + lastDate) + 1;
    days.push({ date: new Date(y, m + 1, nextDay), isCurrentMonth: false });
  }
  return days;
});

const visibleDates = computed(() =>
  allDates.value.slice(page.value * 7, page.value * 7 + 7)
);

onMounted(() => {
  const today = new Date();
  const todayIndex = allDates.value.findIndex(
    (item) => item.date.toDateString() === today.toDateString()
  );
  if (todayIndex !== -1) page.value = Math.floor(todayIndex / 7);
});

const prev = () => {
  if (page.value > 0) {
    page.value--;
    syncSelectedDateWithPage(); // 페이지 이동 시 선택 날짜 동기화
  }
};

const next = () => {
  if ((page.value + 1) * 7 < allDates.value.length) {
    page.value++;
    syncSelectedDateWithPage(); // 페이지 이동 시 선택 날짜 동기화
  }
};

// [추가] 슬라이더 페이지가 이동하면 해당 페이지의 첫 번째 날짜를 부모에게 전달
const syncSelectedDateWithPage = () => {
  const firstDateInPage = visibleDates.value[0].date;
  emit("select", firstDateInPage);
};

// [추가] 부모가 외부(캘린더 모드 등)에서 날짜를 바꿨을 때 슬라이더 페이지를 맞춰주는 로직
watch(
  () => props.selectedDate,
  (newDate) => {
    const index = allDates.value.findIndex(
      (item) => item.date.toDateString() === newDate.toDateString()
    );
    if (index !== -1) {
      page.value = Math.floor(index / 7);
    }
  },
  { immediate: true }
);

const isSelected = (d) =>
  d.toDateString() === props.selectedDate.toDateString();
</script>

<style scoped></style>
