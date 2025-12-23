<template>
  <div class="mt-4 calendar-container custom-calendar">
    <FullCalendar :options="calendarOptions" ref="calendarRef" />
  </div>
</template>

<script setup>
import { computed } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useDietStore } from "@/stores/Diet";
import { storeToRefs } from "pinia";

const dietStore = useDietStore();
const { dailyDietMap } = storeToRefs(dietStore);
const emit = defineEmits(["dateClick"]);

// 식단 기록 유무 점
const events = computed(() => {
  return Object.keys(dailyDietMap.value)
    .filter(
      (date) => dailyDietMap.value[date] && dailyDietMap.value[date].length > 0
    )
    .map((date) => ({
      start: date,
      display: "block",
      classNames: ["diet-dot-event"],
    }));
});

// 달력 옵션을 computed로 감싸서 events 변경을 실시간 반영
const calendarOptions = computed(() => ({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: "dayGridMonth",
  headerToolbar: false,
  locale: "ko",
  height: "auto",
  fixedWeekCount: false,
  events: events.value,

  dayCellContent: (arg) => {
    return arg.dayNumberText.replace("일", "");
  },

  dateClick: (info) => emit("dateClick", info.date),
  dayCellClassNames: "cursor-pointer hover:bg-gray-50 transition-all",
}));
</script>

<style>
.fc-daygrid-day-frame {
  min-height: 140px !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: flex-start !important;
  padding: 4px;
}

.fc-daygrid-day-events {
  margin-top: auto !important;
  margin-bottom: 8px !important;
}

.fc-daygrid-day:hover {
  background-color: #f8f9f4 !important;
  cursor: pointer;
}

.fc-day-sun .fc-daygrid-day-number,
.fc-day-sun .fc-col-header-cell-cushion {
  color: #ef4444 !important;
}

.diet-dot-event {
  background-color: #79ae70 !important;
  border: none !important;
  width: 6px !important;
  height: 6px !important;
  border-radius: 50% !important;
  margin: 8px auto 0 !important;
  display: block !important;
}

.fc-event-title,
.fc-event-time {
  display: none !important;
}
.fc-daygrid-event-harness {
  background: transparent !important;
}

.fc-daygrid-day-top {
  flex-direction: row !important;
  justify-content: center !important;
  margin-bottom: 5px;
}

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
