<template>
  <div class="relative w-full h-79 overflow-hidden">
    <Bar v-if="chartData" :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  BarController,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  BarController
);

const props = defineProps({
  items: Array,
  type: String, // 'week' 또는 'month'
});

const chartData = computed(() => {
  if (!props.items) return null;

  const labels = props.items.map((item) =>
    props.type === "week" ? item.date.slice(5) : `${item.weekStart.slice(8)}일~`
  );
  const scores = props.items.map((item) =>
    props.type === "week" ? item.score : item.averageScore
  );

  return {
    labels,
    datasets: [
      {
        type: "line",
        label: "변화 추이",
        data: scores,
        borderColor: "#8A8F6E",
        borderWidth: 3,
        pointBackgroundColor: "#8A8F6E",
        tension: 0.4,
        fill: false,
        zIndex: 2,
      },
      {
        type: "bar",
        label: "일별 점수",
        data: scores,
        backgroundColor: scores.map((s) =>
          s >= 80 ? "#95de64" : s < 50 ? "#ffccc7" : "#e6f7ff"
        ),
        borderRadius: 6,
        barPercentage: 0.6,
        zIndex: 1,
      },
    ],
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  resizeDelay: 100,
  animation: { duration: 1000, easing: "easeOutQuart" },
  plugins: {
    legend: { display: false },
    tooltip: { mode: "index", intersect: false },
  },
  scales: {
    y: {
      min: 0,
      max: 100,
      grid: {
        color: (context) => {
          if (context.tick.value === 50 || context.tick.value === 80)
            return "rgba(255, 99, 132, 0.4)";
          return "rgba(0, 0, 0, 0.05)";
        },
        lineWidth: (context) =>
          context.tick.value === 50 || context.tick.value === 80 ? 2 : 1,
      },
    },
  },
};
</script>
