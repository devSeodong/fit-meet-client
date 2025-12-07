<template>
  <header class="w-full bg-white border-b shadow-sm">
    <div class="grid grid-cols-12 items-center h-16 px-4 md:px-0">
      <div class="hidden md:block md:col-span-1"></div>

      <div class="col-span-12 md:col-span-10 flex justify-between items-center">
        <div class="text-2xl font-bold text-blue-600 select-none">FIT-MEET</div>

        <!-- 데스크탑 네비 -->
        <nav
          class="hidden md:flex items-center gap-8 text-gray-700 font-medium"
        >
          <RouterLink to="/dashboard" class="hover:text-blue-600"
            >대시보드</RouterLink
          >
          <RouterLink to="/diet" class="hover:text-blue-600"
            >식단관리</RouterLink
          >
          <RouterLink to="/workout" class="hover:text-blue-600"
            >운동영상</RouterLink
          >

          <!-- 로그인/회원가입 or 유저 드롭다운 -->
          <div class="flex items-center gap-4 ml-16">
            <template v-if="!store.isLoggedIn">
              <RouterLink to="/auth/login" class="hover:text-blue-600"
                >로그인</RouterLink
              >
              <span class="text-gray-400">|</span>
              <RouterLink to="/auth/signup" class="hover:text-blue-600"
                >회원가입</RouterLink
              >
            </template>

            <UserDropdown v-else />
          </div>
        </nav>

        <!-- 모바일 햄버거 -->
        <button class="md:hidden text-3xl" @click="open = true">
          <Bars3Icon class="w-8 h-8" />
        </button>
      </div>

      <div class="hidden md:block md:col-span-1"></div>
    </div>

    <!-- 오버레이 -->
    <div
      v-if="open"
      class="fixed inset-0 bg-opacity-40 backdrop-blur-sm z-40"
      @click="closeMenu"
    ></div>

    <!-- 모바일 사이드 메뉴 -->
    <MobileSidebar :open="open" :close="closeMenu" />
  </header>
</template>

<script setup>
import { ref } from 'vue';
import { Bars3Icon } from '@heroicons/vue/24/outline';
import { useAuthStore } from '@/stores/Auth';
import UserDropdown from '@/components/common/UserDropdown.vue';
import MobileSidebar from '@/components/common/MobileSidebar.vue';

const store = useAuthStore();
const open = ref(false);

const closeMenu = () => (open.value = false);
</script>
