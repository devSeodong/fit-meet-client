<!-- <template>
  <div class="p-4 text-center text-gray-500">월간 캘린더 영역 (추후 구현)</div>
</template>

<script setup>
defineProps({
  selectedMonth: Date,
});
</script> -->
<template>
  <FullCalendar :options="options" ref="calendarRef" />
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useDietStore } from '@/stores/Diet';

const emit = defineEmits(['select-date']);
const calendarRef = ref(null);
const dietStore = useDietStore();

/* 📌 식단 있는 날짜 → 이벤트로 변환 */
const events = computed(() =>
  Object.keys(dietStore.dailyDietMap).map(date => ({
    date,
    display: 'background', // 배경 이벤트
  })),
);

const options = ref({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  headerToolbar: false,
  fixedWeekCount: false,

  events,

  dateClick(info) {
    emit('select-date', info.dateStr);
  },

  dayCellContent(arg) {
    const hasDiet = dietStore.dailyDietMap[arg.dateStr]?.length > 0;

    return {
      html: `
        <div class="fc-day-number">${arg.dayNumberText}</div>
        ${hasDiet ? `<div class="diet-dot"></div>` : ''}
      `,
    };
  },
});
</script>

<style scoped>
:deep(.diet-dot) {
  width: 6px;
  height: 6px;
  margin: 4px auto 0;
  border-radius: 50%;
  background-color: #8a8f6e;
}

:deep(.fc-day-other) {
  opacity: 0.4;
}
</style>
