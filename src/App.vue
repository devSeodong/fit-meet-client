<script setup>
import AppHeader from '@/components/common/Header.vue';
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/Auth';
import MobileSidebar from './components/common/MobileSidebar.vue';
import { useRouter } from 'vue-router';

const store = useAuthStore();
const router = useRouter();

onMounted(async () => {
  // 쿠키 기반 로그인 복구
  const publicRoutes = ['login', 'signup', 'passwordReset'];

  if (!publicRoutes.includes(router.currentRoute.value.name)) {
    await store.fetchBasicUserInfo();
  }
});
</script>

<template>
  <div class="bg-blur-container">
    <!-- <div> -->
    <AppHeader />
    <router-view />
  </div>

  <teleport to="body">
    <div class="blur-layer blur-top-left"></div>
    <div class="blur-layer blur-top-right"></div>
    <div class="blur-layer blur-bottom-left"></div>
    <div class="blur-layer blur-bottom-right"></div>
  </teleport>

  <MobileSidebar />
</template>

<style scoped></style>
