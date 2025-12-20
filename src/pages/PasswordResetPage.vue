<template>
  <PasswordResetContainer>
    <PasswordResetForm v-if="!resetToken" />

    <div v-else class="min-h-[200px] flex items-center justify-center">
      <div
        v-if="tokenStatus === 'pending'"
        class="text-gray-500 flex flex-col items-center gap-3"
      >
        <div class="spinner-lg"></div>
        <p>토큰 유효성을 확인 중입니다...</p>
      </div>

      <NewPasswordForm
        v-else-if="tokenStatus === 'valid'"
        :reset-token="resetToken"
      />

      <div
        v-else-if="tokenStatus === 'invalid'"
        class="text-center text-red-600 p-8 border border-red-300 rounded-lg bg-red-50"
      >
        <h3 class="text-xl font-bold mb-2">
          유효하지 않거나 만료된 링크입니다.
        </h3>
        <p>비밀번호 재설정을 다시 요청해 주세요.</p>
        <RouterLink
          :to="{ name: 'passwordReset' }"
          class="text-sm text-red-700 underline mt-4 block"
        >
          다시 재설정 이메일 요청 페이지로 돌아가기
        </RouterLink>
      </div>

      <div v-else>알 수 없는 오류가 발생했습니다.</div>
    </div>
  </PasswordResetContainer>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/Auth';

import PasswordResetContainer from '@/components/auth/passwordReset/PasswordResetContainer.vue'; // 경로 수정 필요
import PasswordResetForm from '@/components/auth/passwordReset/PasswordResetEmailForm.vue'; // 경로 수정 필요
import NewPasswordForm from '@/components/auth/passwordReset/NewPasswordForm.vue'; // 새로 만든 폼

const route = useRoute();
const store = useAuthStore();
const resetToken = computed(() => route.query.token);

// 토큰 유효성 상태 ('pending', 'valid', 'invalid')
const tokenStatus = ref('pending');

// 토큰 유효성 검사
const validateToken = async token => {
  if (!token) return;

  tokenStatus.value = 'pending';
  try {
    const res = await store.validatePasswordReset(token);

    if (res.status === 200 && res.data === 'VALID') {
      tokenStatus.value = 'valid';
    } else {
      tokenStatus.value = 'invalid';
    }
  } catch (error) {
    console.error('Token validation failed:', error);
    tokenStatus.value = 'invalid';
  }
};

// 컴포넌트 마운트 시 토큰 검사 실행
onMounted(() => {
  if (resetToken.value) {
    validateToken(resetToken.value);
  } else {
    // 토큰이 없으면 1단계 이메일 폼으로 자동 전환 (pending 상태 건너뜀)
    tokenStatus.value = null;
  }
});
</script>

<style scoped>
.spinner-lg {
  border: 5px solid rgba(211, 163, 115, 0.3);
  border-top: 5px solid #d3a373;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
