<template>
  <div class="mt-4 calendar-container custom-calendar">
    <FullCalendar :options="calendarOptions" ref="calendarRef" />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useDietStore } from '@/stores/Diet';
import { storeToRefs } from 'pinia';

const dietStore = useDietStore();
const { dailyDietMap } = storeToRefs(dietStore);
const emit = defineEmits(['dateClick']);

// 💡 1. 점(Event) 데이터 생성
const events = computed(() => {
  return Object.keys(dailyDietMap.value)
    .filter(
      date => dailyDietMap.value[date] && dailyDietMap.value[date].length > 0,
    )
    .map(date => ({
      start: date,
      display: 'block',
      classNames: ['diet-dot-event'],
    }));
});

// 💡 2. 달력 옵션을 computed로 감싸서 events 변경을 실시간 반영
const calendarOptions = computed(() => ({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  headerToolbar: false,
  locale: 'ko',
  height: 'auto',
  fixedWeekCount: false,
  events: events.value, // .value 필수

  // 💡 [요구사항] '일' 제거 로직
  dayCellContent: arg => {
    return arg.dayNumberText.replace('일', '');
  },

  dateClick: info => emit('dateClick', info.date),
  dayCellClassNames: 'cursor-pointer hover:bg-gray-50 transition-all',
}));
</script>

<style>
/* 💡 [요구사항] 세로 간격(높이) 키우기 */
.fc-daygrid-day-frame {
  min-height: 100px !important;
  display: flex !important;
  flex-direction: column !important; /* 위에서 아래로 흐르게 */
  justify-content: flex-start !important;
  padding: 4px;
}

/* 3. 이벤트(점) 컨테이너를 바닥으로 밀기 */
.fc-daygrid-day-events {
  margin-top: auto !important; /* 핵심: 위쪽 여백을 자동으로 채워 아래로 밀어냄 */
  margin-bottom: 8px !important; /* 바닥에서 살짝 띄움 */
}

/* 호버 시 배경색 및 포인터 */
.fc-daygrid-day:hover {
  background-color: #f8f9f4 !important;
  cursor: pointer;
}

/* 1. 일요일 빨간색 (날짜 숫자와 헤더 모두) */
.fc-day-sun .fc-daygrid-day-number,
.fc-day-sun .fc-col-header-cell-cushion {
  color: #ef4444 !important;
}

/* 2. 점(이벤트) 스타일 - 숫자 바로 아래 배치 */
.diet-dot-event {
  background-color: #79ae70 !important;
  border: none !important;
  width: 6px !important;
  height: 6px !important;
  border-radius: 50% !important;
  margin: 8px auto 0 !important; /* 간격 살짝 넓힘 */
  display: block !important;
}

/* 3. 기본 요소 정리 */
.fc-event-title,
.fc-event-time {
  display: none !important;
}
.fc-daygrid-event-harness {
  background: transparent !important;
}

/* 4. 날짜 숫자 스타일 (오른쪽 정렬 해제 및 중앙 정렬 원할 시 사용) */
.fc-daygrid-day-top {
  flex-direction: row !important;
  justify-content: center !important; /* 날짜 숫자 중앙 정렬 */
  margin-bottom: 5px;
}

/* 3. 이벤트(점) 컨테이너를 바닥으로 밀기 */

/* 5. 호버 효과 */
.fc-daygrid-day:hover {
  background-color: #f8f9f4 !important;
  cursor: pointer;
}

.fc-theme-standard td,
.fc-theme-standard th {
  border: 1px solid #f3f4f6 !important;
}
.fc-scrollgrid {
  border: none !important;
}
</style>
