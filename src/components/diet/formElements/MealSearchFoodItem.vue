<template>
  <div>
    <div
      class="p-3 border-b border-gray-100 last:border-b-0 flex justify-between items-start bg-white hover:bg-gray-50 transition rounded-lg"
    >
      <div class="flex flex-col flex-grow min-w-0 pr-4">
        <span class="text-base font-medium text-gray-700 truncate">{{
          food.foodNmKr
        }}</span>
        <span class="text-xs text-gray-500 mt-0.5">
          카테고리: {{ food.category }}
          <!-- | 출처: {{ food.sourceType }} -->
        </span>
        <span class="text-xs text-gray-500 mt-0.5">
          기본 제공량: {{ food.servingSizeRaw || '정보 없음' }}
        </span>
      </div>

      <button
        v-if="!isEditing"
        @click="startEdit"
        class="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium hover:bg-green-700 transition flex-shrink-0"
      >
        추가
      </button>

      <button
        v-else
        @click="cancelEdit"
        class="bg-gray-400 text-white px-3 py-1 rounded-full text-sm font-medium hover:bg-gray-500 transition flex-shrink-0"
      >
        취소
      </button>
    </div>

    <div
      v-if="isEditing"
      class="p-3 bg-blue-50 border-t border-blue-200 rounded-b-lg mt-0.5"
    >
      <div class="flex items-center gap-2">
        <label class="text-sm font-medium text-gray-700 shrink-0"
          >섭취량:</label
        >
        <input
          type="number"
          v-model.number="currentIntake"
          :placeholder="`기본값: ${initialIntake}g`"
          class="input-style flex-1 p-2 text-sm"
          min="1"
        />
        <span class="text-sm font-medium text-gray-700 shrink-0">{{
          unit
        }}</span>

        <button
          @click="confirmAdd"
          :disabled="isProcessing || currentIntake <= 0"
          class="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-700 transition shrink-0 disabled:bg-gray-300"
        >
          {{ isProcessing ? '처리 중...' : '확인' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useDietStore } from '@/stores/Diet';
import { parseServingSize } from '@/utils/FoodUtils';

const props = defineProps({
  food: {
    type: Object,
    required: true,
  },
});

// 부모에게 전달
const emit = defineEmits(['food-added']);

const dietStore = useDietStore();

const isEditing = ref(false);
const currentIntake = ref(0);
const isProcessing = ref(false);

// food.servingSizeRaw에서 기본 용량과 단위를 파싱
const { amount: initialIntake, unit } = parseServingSize(
  props.food.servingSizeRaw,
);

const startEdit = () => {
  // 기본값을 currentIntake에 설정하고 편집 모드 시작
  currentIntake.value = initialIntake;
  isEditing.value = true;
};

const cancelEdit = () => {
  isEditing.value = false;
  currentIntake.value = 0;
};

const confirmAdd = async () => {
  if (currentIntake.value <= 0) {
    alert('섭취량을 0보다 크게 입력해 주세요.');
    return;
  }

  isProcessing.value = true;

  try {
    const requestFoodArray = [
      {
        foodCode: props.food.foodCd,
        foodNmKr: props.food.foodNmKr,
        sourceType: props.food.sourceType,
        intakeGram: currentIntake.value,

        // 서버에서 재계산하므로, 기존의 영양소 값은 0 또는 누락 가능 (테스트 필요)
        kcal: 0,
        carbohydrate: 0,
        protein: 0,
        fat: 0,
      },
    ];

    const responseData = await dietStore.fetchDietNutrition(requestFoodArray);

    if (responseData) {
      //  서버 응답에서 우리가 최종적으로 추가해야 할 음식 객체를 추출합니다.
      // 서버는 foods 배열과 totals를 포함한 객체를 반환합니다.
      // 추가할 음식은 요청으로 보냈던 배열의 첫 번째 요소가 재계산되어 돌아온 것이므로, foods[0]을 추출합니다.
      const finalFoodData = responseData.foods ? responseData.foods[0] : null;

      if (finalFoodData) {
        emit('food-added', finalFoodData);
        cancelEdit();
      } else {
        throw new Error(
          '서버 응답에서 재계산된 음식 데이터를 찾을 수 없습니다.',
        );
      }
    }
  } catch (error) {
    console.error('음식 추가/영양소 재조회 실패:', error);
    alert('음식 추가 중 오류가 발생했습니다.');
  } finally {
    isProcessing.value = false;
  }
};
</script>

<style scoped>
.input-style {
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}
.input-style:focus {
  outline: none;
  border-color: #8a8f6e;
  box-shadow: 0 0 0 2px #8a8f6e, 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}
</style>
