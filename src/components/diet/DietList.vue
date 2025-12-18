<template>
  <div class="my-4">
    <!-- <h3 class="text-lg font-bold mb-6">{{ mealLabel }} 식단</h3> -->

    <div v-if="!diets || diets.length === 0" class="text-gray-500 py-4">
      등록된 식단이 없습니다.
    </div>

    <div
      v-else
      v-for="diet in diets"
      :key="diet.dietId || diet.id"
      @click="$emit('itemClick', diet)"
      class="p-4 shadow-sm border-gray-300 border rounded-lg mb-2 hover:shadow-[#fbecd6] hover:border-[#fbecd6] transition cursor-pointer"
    >
      <p class="font-bold">{{ diet.description || '식단 정보' }}</p>
      <p class="text-sm text-gray-500">
        {{ diet.totalKcal || diet.kcal || 0 }} kcal
      </p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  diets: Array,
  mealLabel: String,
});
</script>
