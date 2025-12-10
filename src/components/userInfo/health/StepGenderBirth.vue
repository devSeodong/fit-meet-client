<!-- <template>
  <div class="flex flex-col gap-6 items-center w-full">
    <h3 class="text-xl font-semibold text-green-700">성별</h3>

    <div class="flex gap-4">
      <button
        v-for="g in genders"
        :key="g.value"
        @click="model.gender = g.value"
        class="px-6 py-3 rounded-xl border transition"
        :class="
          model.gender === g.value
            ? 'bg-green-600 text-white'
            : 'bg-gray-100 text-gray-700'
        "
      >
        {{ g.label }}
      </button>
    </div>

    <h3 class="text-xl font-semibold text-green-700">생년월일</h3>
    <input
      type="date"
      v-model="model.birth_date"
      class="border rounded-xl px-4 py-2 w-60 mt-4"
    />
  </div>
</template>

<script setup>
const model = defineModel();

const genders = [
  { value: 'MALE', label: '남성' },
  { value: 'FEMALE', label: '여성' },
  // { value: 'OTHER', label: '기타' },
];
</script> -->

<!-- 2 -->
<!-- <template>
  <div
    class="flex flex-col gap-8 w-full max-w-md mx-auto p-4 sm:p-6 bg-white rounded-xl shadow-lg"
  >
    <div class="flex flex-col gap-3">
      <label class="text-lg font-semibold text-gray-700">성별</label>
      <div class="flex gap-4">
        <button
          v-for="g in genders"
          :key="g.value"
          @click="model.gender = g.value"
          class="flex-1 px-4 py-3 rounded-xl border text-base font-medium transition duration-200 ease-in-out shadow-sm"
          :class="
            model.gender === g.value
              ? 'bg-green-600 text-white border-green-600 hover:bg-green-700'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          "
        >
          {{ g.label }}
        </button>
      </div>
    </div>

    <div class="flex flex-col gap-3">
      <label for="birth_date" class="text-lg font-semibold text-gray-700"
        >생년월일</label
      >
      <input
        id="birth_date"
        type="date"
        v-model="model.birth_date"
        class="border border-gray-300 rounded-xl px-4 py-3 text-gray-800 focus:ring-green-500 focus:border-green-500 transition duration-150"
      />
    </div>
  </div>
</template>

<script setup>
const model = defineModel();

const genders = [
  { value: 'MALE', label: '남성' },
  { value: 'FEMALE', label: '여성' },
  // 필요하다면 { value: 'OTHER', label: '기타' }를 추가합니다.
];
</script> -->
<template>
  <div class="flex flex-col gap-8 w-full max-w-md mx-auto">
    <div class="flex flex-col gap-3">
      <label class="text-xl font-bold text-gray-700">성별</label>
      <div class="flex gap-4">
        <button
          v-for="g in genders"
          :key="g.value"
          @click="model.gender = g.value"
          class="flex-1 px-4 py-3 rounded-xl border text-base font-medium transition duration-200 ease-in-out shadow-sm"
          :class="
            model.gender === g.value
              ? 'bg-green-600 text-white border-green-600 hover:bg-green-700'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          "
        >
          {{ g.label }}
        </button>
      </div>
    </div>

    <div class="flex flex-col gap-3">
      <label for="birth_date" class="text-xl font-bold text-gray-700"
        >생년월일</label
      >
      <input
        id="birth_date"
        type="date"
        v-model="model.birth_date"
        class="border border-gray-300 rounded-xl px-4 py-3 text-gray-800 focus:ring-green-500 focus:border-green-500 transition duration-150 text-lg"
      />
    </div>
  </div>
</template>

<script setup>
const model = defineModel();

const genders = [
  { value: 'MALE', label: '남성' },
  { value: 'FEMALE', label: '여성' },
];
</script>
