<template>
  <div class="min-h-screen flex items-center justify-center bg-white">
    <div class="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
      <!-- LEFT: 로그인 폼 -->
      <div class="bg-white rounded-2xl shadow-md p-10 flex flex-col gap-6">
        <h2 class="text-3xl flex justify-center">LOGIN</h2>
        <hr />
        <LoginForm />
      </div>

      <!-- RIGHT: 모바일에서는 숨김 -->
      <div
        class="bg-white rounded-2xl shadow-md p-10 flex-col justify-center items-center gap-4 hidden md:flex"
      >
        <p>아직 회원가입이 안되셨나요?</p>
        <RouterLink to="/auth/signup" class="hover:text-[#68b478]">
          회원가입 하러가기
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import LoginForm from '@/components/auth/LoginForm.vue';
</script>
