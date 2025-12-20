<template>
  <div
    class="bg-white h-auto p-4 md:p-5 rounded-lg shadow border border-gray-100"
  >
    <div class="flex items-center justify-between mb-4 md:mb-6">
      <h2 class="text-xl font-bold text-gray-800 flex items-center gap-2">
        <span
          class="hidden md:inline w-1.5 h-5 bg-[#8A8F6E] rounded-full"
        ></span>
        오늘의 섭취량
      </h2>
      <span
        class="md:hidden text-[10px] text-gray-400 font-medium tracking-tighter"
        >단위: kcal, g</span
      >
    </div>

    <div
      v-if="dashboardStore.todayNutrition"
      class="hidden md:grid grid-cols-4 gap-4"
    >
      <NutritionField
        title="칼로리"
        :consumed="data.todayKcal"
        :goal="goals.kcal"
        unit="kcal"
        type="kcal"
        :progress-percent="(data.todayKcal / goals.kcal) * 100"
      />
      <NutritionField
        title="탄수화물"
        :consumed="data.todayCarbohydrate"
        :goal="goals.carb"
        unit="g"
        type="carb"
        :progress-percent="(data.todayCarbohydrate / goals.carb) * 100"
      />
      <NutritionField
        title="단백질"
        :consumed="data.todayProtein"
        :goal="goals.protein"
        unit="g"
        type="protein"
        :progress-percent="(data.todayProtein / goals.protein) * 100"
      />
      <NutritionField
        title="지방"
        :consumed="data.todayFat"
        :goal="goals.fat"
        unit="g"
        type="fat"
        :progress-percent="(data.todayFat / goals.fat) * 100"
      />
    </div>

    <div class="md:hidden flex flex-col gap-4">
      <div class="md:hidden flex flex-col gap-4">
        <MobileNutritionField
          type="kcal"
          title="Total Calories"
          :consumed="data.todayKcal"
          :goal="goals.kcal"
          unit="kcal"
        />

        <div class="space-y-3">
          <MobileNutritionField
            type="carb"
            title="탄수화물"
            :consumed="data.todayCarbohydrate"
            :goal="goals.carb"
            unit="g"
          />
          <MobileNutritionField
            type="protein"
            title="단백질"
            :consumed="data.todayProtein"
            :goal="goals.protein"
            unit="g"
          />
          <MobileNutritionField
            type="fat"
            title="지방"
            :consumed="data.todayFat"
            :goal="goals.fat"
            unit="g"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import NutritionField from './NutritionField.vue';
import { useDashboardStore } from '@/stores/Dashboard';
import MobileNutritionField from './MobileNutritionField.vue';

const dashboardStore = useDashboardStore();

// 데이터 안전성 확보 (비어있을 경우 대비)
const data = computed(
  () =>
    dashboardStore.todayNutrition || {
      todayKcal: 0,
      todayCarbohydrate: 0,
      todayProtein: 0,
      todayFat: 0,
    },
);

const goals = computed(
  () =>
    dashboardStore.nutrientGoals || {
      kcal: 2000,
      carb: 300,
      protein: 150,
      fat: 70,
    },
);

onMounted(() => {
  dashboardStore.fetchTodayNutrition();
});
</script>

<style scoped>
.progress-inner-shadow {
  box-shadow: inset 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}
</style>
