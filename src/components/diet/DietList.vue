<template>
  <div class="mb-4 bg-gray-50">
    <!-- <h3 class="text-lg font-bold mb-6">{{ mealLabel }} 식단</h3> -->

    <div
      v-if="!diets || diets.length === 0"
      class="text-gray-500 py-8 text-center"
    >
      <div class="text-gray-400 font-bold mb-4">
        해당 시간대 식단이 텅 비었어요..ㅠ^ㅠ
      </div>
      <button
        @click="goToCreate"
        class="px-8 py-3 bg-[#8A8F6E] text-white rounded-full font-black hover:bg-[#6e7256] cursor-pointer shadow-lg transition"
      >
        식단 추가하러가기
      </button>
    </div>

    <div
      v-else
      v-for="diet in diets"
      :key="diet.dietId || diet.id"
      @click="$emit('itemClick', diet)"
      class="p-4 shadow-sm border-gray-300 border rounded-lg mt-4 mb-2 hover:shadow-[#fbecd6] hover:border-[#fbecd6] transition cursor-pointer"
    >
      <p class="font-bold">{{ diet.description || '식단 정보' }}</p>
      <p class="text-sm text-gray-500">
        {{ diet.totalKcal || diet.kcal || 0 }} kcal
      </p>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

defineProps({
  diets: Array,
  mealLabel: String,
});
const router = useRouter();
const goToCreate = () => {
  router.push({ name: 'dietForm', params: { method: 'public-api' } });
};
</script>
