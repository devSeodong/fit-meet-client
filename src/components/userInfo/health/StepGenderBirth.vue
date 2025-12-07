<template>
  <div class="space-y-6">
    <h2 class="text-xl font-semibold">기본 정보</h2>

    <!-- 성별 -->
    <div>
      <label class="block mb-2 text-gray-700">성별</label>
      <div class="flex gap-3">
        <button
          v-for="g in genders"
          :key="g"
          @click="update('gender', g)"
          class="px-4 py-2 rounded-lg border"
          :class="model.gender === g ? 'bg-blue-600 text-white' : 'bg-white'"
        >
          {{ g }}
        </button>
      </div>
    </div>

    <!-- 생년월일 -->
    <div>
      <label class="block mb-2 text-gray-700">생년월일</label>
      <input
        type="date"
        class="w-full px-4 py-2 border rounded-lg"
        v-model="model.birth_date"
      />
    </div>
  </div>
</template>

<script setup>
const genders = ['MALE', 'FEMALE', 'OTHER'];

const model = defineModel();

const update = (field, value) => {
  model[field] = value;
};
</script>
