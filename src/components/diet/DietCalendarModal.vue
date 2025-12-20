<template>
  <div
    v-if="isVisible"
    @click.self="$emit('close')"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
  >
    <div
      class="bg-[#f9f9f5] w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
    >
      <div class="bg-white border-b border-gray-100 shrink-0 shadow-sm z-10">
        <div class="flex border-b border-gray-50">
          <button
            v-for="(label, type) in mealLabelMap"
            :key="type"
            @click="activeTab = type"
            :class="[
              'flex-1 py-4 text-sm font-bold transition-colors',
              activeTab === type
                ? 'text-[#8A8F6E] border-b-2 border-[#8A8F6E]'
                : 'text-gray-400',
            ]"
          >
            {{ label }}
          </button>
        </div>
        <div class="p-4 bg-gray-50/50 flex justify-between items-center">
          <p class="text-sm font-extrabold text-gray-800">
            {{ formattedDate }}
          </p>
          <span
            class="text-xs bg-[#8A8F6E]/10 text-[#8A8F6E] px-2 py-1 rounded-md font-bold"
          >
            총 {{ currentDietDetails.length }}건
          </span>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        <div
          v-if="isLoading"
          class="py-20 text-center text-gray-400 font-medium"
        >
          정보를 불러오는 중...
        </div>

        <template v-else-if="currentDietDetails.length > 0">
          <div
            v-for="(diet, index) in currentDietDetails"
            :key="diet.id || index"
            class="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden transition-all hover:shadow-lg"
          >
            <div
              class="p-4 bg-white border-b border-gray-300 flex justify-between items-center"
            >
              <div>
                <span
                  class="text-[10px] text-[#8A8F6E] font-black uppercase tracking-wider"
                  >Meal #{{ index + 1 }}</span
                >
                <h3 class="text-lg font-black text-gray-800 leading-tight">
                  {{ getDisplayTitle(diet) }}
                </h3>
              </div>
              <div class="flex space-x-1">
                <button
                  @click="handleEdit(diet)"
                  class="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition"
                >
                  <PencilSquareIcon class="w-5 h-5" />
                </button>
                <button
                  @click="handleDelete(diet.id)"
                  class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition"
                >
                  <TrashIcon class="w-5 h-5" />
                </button>
              </div>
            </div>

            <div class="p-4 space-y-5">
              <div class="px-3 py-2 space-y-3 rounded-xl gradient-border">
                <div class="flex items-end justify-between">
                  <span class="text-sm font-bold text-gray-500"
                    >영양소 밸런스</span
                  >
                  <span class="text-xl font-black text-red-500">
                    {{ calculateTotals(diet).kcal
                    }}<small class="text-xs font-bold text-gray-400 ml-0.5"
                      >kcal</small
                    >
                  </span>
                </div>

                <div
                  class="w-full h-3 flex rounded-full overflow-hidden bg-gray-100"
                >
                  <div
                    :style="{ width: `${calculateRatios(diet).carbohydrate}%` }"
                    class="bg-blue-400"
                  ></div>
                  <div
                    :style="{ width: `${calculateRatios(diet).protein}%` }"
                    class="bg-green-400"
                  ></div>
                  <div
                    :style="{ width: `${calculateRatios(diet).fat}%` }"
                    class="bg-orange-400"
                  ></div>
                </div>

                <div class="grid grid-cols-3 gap-2 text-center">
                  <div
                    class="py-2 bg-blue-50/50 rounded-xl border border-blue-100/50"
                  >
                    <p class="text-blue-600 text-xs font-black">
                      {{ calculateTotals(diet).carbohydrate }}g
                    </p>
                    <p class="text-[10px] text-blue-400 font-bold">탄수화물</p>
                  </div>
                  <div
                    class="py-2 bg-green-50/50 rounded-xl border border-green-100/50"
                  >
                    <p class="text-green-600 text-xs font-black">
                      {{ calculateTotals(diet).protein }}g
                    </p>
                    <p class="text-[10px] text-green-400 font-bold">단백질</p>
                  </div>
                  <div
                    class="py-2 bg-orange-50/50 rounded-xl border border-orange-100/50"
                  >
                    <p class="text-orange-600 text-xs font-black">
                      {{ calculateTotals(diet).fat }}g
                    </p>
                    <p class="text-[10px] text-orange-400 font-bold">지방</p>
                  </div>
                </div>
              </div>

              <div class="bg-gray-50 rounded-xl p-3 space-y-2">
                <p class="text-sm font-bold text-gray-500">섭취한 음식 목록</p>
                <div
                  v-for="food in diet.foods"
                  :key="food.id"
                  class="flex justify-between items-center bg-white p-2.5 rounded-lg shadow-sm border border-gray-100"
                >
                  <div class="flex flex-col">
                    <span class="text-xs font-bold text-gray-700">{{
                      food.foodNmKr
                    }}</span>
                    <span class="text-[10px] text-gray-400 font-medium"
                      >{{ food.intakeGram }}g</span
                    >
                  </div>
                  <span class="text-xs font-black text-[#8A8F6E]"
                    >{{ food.kcal }} kcal</span
                  >
                </div>
              </div>

              <div
                v-if="diet.description"
                class="relative pl-4 mx-1 border-l-2 border-[#8A8F6E]/30"
              >
                <p class="text-sm font-bold text-gray-500">식단 메모</p>
                <p class="text-xs text-gray-500 italic leading-relaxed">
                  " {{ diet.description }} "
                </p>
              </div>
            </div>
          </div>
        </template>

        <div v-else class="py-20 text-center">
          <div class="text-gray-400 font-bold mb-4">
            해당 시간대 식단이 텅 비었어요
          </div>
          <button
            @click="goToCreate"
            class="px-8 py-3 bg-[#8A8F6E] text-white rounded-full font-black hover:bg-[#6e7256] cursor-pointer shadow-lg transition"
          >
            식단 추가하러가기
          </button>
        </div>
      </div>

      <button
        @click="$emit('close')"
        class="p-5 text-gray-400 text-sm font-bold border-t border-gray-100 bg-white hover:bg-gray-50 transition shrink-0 cursor-pointer"
      >
        닫기
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useDietStore } from '@/stores/Diet';
import { PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
  isVisible: Boolean,
  selectedDate: Date,
  diets: Array,
});
const emit = defineEmits(['close']);

const router = useRouter();
const dietStore = useDietStore();
const activeTab = ref('breakfast');
const currentDietDetails = ref([]);
const isLoading = ref(false);

const mealTypeMap = {
  breakfast: 'A',
  lunch: 'B',
  dinner: 'C',
  snack: 'D',
  nightSnack: 'E',
};
const mealLabelMap = {
  breakfast: '아침',
  lunch: '점심',
  dinner: '저녁',
  snack: '간식',
  nightSnack: '야식',
};

// 날짜 포맷팅
const formattedDate = computed(() => {
  if (!props.selectedDate) return '';
  return new Date(props.selectedDate).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });
});

// 각 식단별 타이틀 생성
const getDisplayTitle = diet => {
  const foods = diet.foods || [];
  if (foods.length === 0) return '식단 정보';
  if (foods.length === 1) return foods[0].foodNmKr;
  return `${foods[0].foodNmKr} 외 ${foods.length - 1}개`;
};

// 영양소 계산 (개별 식단용)
const calculateTotals = diet => {
  const totals = { kcal: 0, carbohydrate: 0, protein: 0, fat: 0 };
  diet.foods?.forEach(f => {
    totals.kcal += Number(f.kcal || 0);
    totals.carbohydrate += Number(f.carbohydrate || 0);
    totals.protein += Number(f.protein || 0);
    totals.fat += Number(f.fat || 0);
  });
  return totals;
};

// 비율 계산 (개별 식단용)
const calculateRatios = diet => {
  const { carbohydrate: c, protein: p, fat: f } = calculateTotals(diet);
  const total = c * 4 + p * 4 + f * 9;
  if (total === 0) return { carbohydrate: 0, protein: 0, fat: 0 };
  return {
    carbohydrate: ((c * 4) / total) * 100,
    protein: ((p * 4) / total) * 100,
    fat: ((f * 9) / total) * 100,
  };
};

// 데이터 Fetch 로직
watch(
  [activeTab, () => props.isVisible, () => props.diets],
  async () => {
    if (!props.isVisible) return;

    const summaries = props.diets.filter(
      d => (d.mealType || d.meal_type) === mealTypeMap[activeTab.value],
    );

    if (summaries.length > 0) {
      isLoading.value = true;
      try {
        const details = await Promise.all(
          summaries.map(s => dietStore.fetchDietDetail(s.dietId || s.id)),
        );
        currentDietDetails.value = details;
      } catch (err) {
        console.error('Fetch Error', err);
      } finally {
        isLoading.value = false;
      }
    } else {
      currentDietDetails.value = [];
    }
  },
  { immediate: true },
);

const goToCreate = () => {
  router.push({ name: 'dietForm', params: { method: 'public-api' } });
};

const handleEdit = diet => {
  // 수동 입력 식단인 경우 manual, API 검색 식단인 경우 public-api
  const method = diet.sourceType === 'MANUAL' ? 'manual' : 'public-api';

  router.push({
    name: 'dietForm',
    params: {
      method: method,
      id: diet.id,
    },
  });
};

const handleDelete = async dietId => {
  if (confirm('정말 이 식단을 삭제하시겠습니까?')) {
    try {
      const dateKey = props.selectedDate.toLocaleDateString('en-CA');
      await dietStore.deleteDiet(dietId, dateKey);
      alert('삭제되었습니다.');
      currentDietDetails.value = currentDietDetails.value.filter(
        d => d.id !== dietId,
      );
      if (currentDietDetails.value.length === 0) emit('close');
    } catch (err) {
      alert('삭제 중 오류가 발생했습니다.');
    }
  }
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 10px;
}

.gradient-border {
  border: 2px solid transparent;
  background-image: linear-gradient(#fff, #fff),
    linear-gradient(135deg, #60a5fa 0%, #4ade80 50%, #fb923c 100%);
  background-origin: border-box;
  background-clip: padding-box, border-box;
}
</style>
