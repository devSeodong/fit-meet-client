<script setup>
import AppHeader from '@/components/common/Header.vue';
import { onMounted } from 'vue';
import { useUserStore } from '@/stores/User';

const store = useUserStore();

onMounted(async () => {
  // 쿠키 기반 로그인 복구
  await store.fetchUserInfo();
});
</script>

<template>
  <AppHeader />

  <router-view />
</template>

<style scoped></style>
