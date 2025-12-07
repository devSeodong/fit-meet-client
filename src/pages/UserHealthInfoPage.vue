<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-10">
      <!-- 진행바 -->
      <div class="mb-10">
        <ProgressBar :step="step" :total="5" />
      </div>
      <!-- 제목 -->
      <h2 class="text-2xl font-semibold text-center mb-6">신체 정보 입력</h2>

      <!-- 구분선 -->
      <hr class="mb-8" />

      <!-- 단계별 콘텐츠 -->
      <div class="min-h-[280px] flex items-center justify-center">
        <component :is="currentComponent" v-model="formData" />
      </div>

      <!-- 다음/이전 버튼 -->
      <div class="flex justify-between mt-10">
        <!-- 이전 -->
        <button
          v-if="step > 1"
          @click="prevStep"
          class="px-6 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 transition"
        >
          이전
        </button>

        <div class="ml-auto">
          <!-- 다음 -->
          <button
            v-if="step < 5"
            @click="nextStep"
            class="px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            다음
          </button>

          <!-- 완료 -->
          <button
            v-if="step === 5"
            @click="submit"
            class="px-6 py-3 rounded-xl bg-green-600 text-white hover:bg-green-700 transition"
          >
            완료
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useUserStore } from '@/stores/User';

import ProgressBar from '@/components/userInfo/health/ProgressBar.vue';
import StepGenderBirth from '@/components/userInfo/health/StepGenderBirth.vue';
import StepHeight from '@/components/userInfo/health/StepHeight.vue';
import StepWeight from '@/components/userInfo/health/StepWeight.vue';
import StepTargetWeight from '@/components/userInfo/health/StepTargetWeight.vue';
import StepActivityLevel from '@/components/userInfo/health/StepActivityLevel.vue';

const store = useUserStore();

const step = ref(1);

const formData = reactive({
  gender: null,
  birth_date: null,
  height_cm: null,
  weight_kg: null,
  target_weight_kg: null,
  activity_level: null,
});

const components = [
  StepGenderBirth,
  StepHeight,
  StepWeight,
  StepTargetWeight,
  StepActivityLevel,
];

const currentComponent = computed(() => components[step.value - 1]);

const nextStep = () => {
  if (step.value < 5) step.value++;
};

const prevStep = () => {
  if (step.value > 1) step.value--;
};

const submit = () => {
  store.user = { ...store.user, ...formData };
  alert('신체 정보가 저장되었습니다.');
};
</script>
