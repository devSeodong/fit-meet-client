<template>
  <div class="min-h-screen flex items-center justify-center bg-white">
    <div class="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
      <!-- LEFT -->
      <div class="bg-white rounded-2xl shadow-md p-10 flex flex-col gap-6">
        <h2 class="text-3xl flex justify-center">SIGNUP</h2>
        <hr />
        <SignupForm />
      </div>

      <!-- RIGHT: 모바일에서는 숨김 -->
      <div
        class="bg-white rounded-2xl shadow-md p-10 flex-col justify-center items-center gap-4 hidden md:flex"
      >
        <p>이미 계정이 있으신가요?</p>
        <RouterLink to="/auth/login" class="hover:text-[#68b478]">
          로그인 하러가기
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import SignupForm from '@/components/auth/SignupForm.vue';
</script>
