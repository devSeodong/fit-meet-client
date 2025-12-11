<template>
  <div
    class="fixed top-0 right-0 h-full bg-white shadow-xl z-50 transform transition-transform duration-300 flex flex-col"
    :class="open ? 'translate-x-0 w-3/4' : 'translate-x-full w-3/4'"
  >
    <!-- 상단 헤더 -->
    <div class="flex justify-between items-center px-12 py-4 shadow-sm">
      <span class="text-xl font-bold">메뉴</span>
      <button class="text-2xl" @click="close">
        <XMarkIcon class="w-8 h-8" />
      </button>
    </div>

    <!-- 메뉴 리스트 -->
    <nav
      class="flex flex-col gap-8 p-12 text-lg font-medium flex-1 overflow-y-auto"
    >
      <RouterLink to="/dashboard" @click="close">대시보드</RouterLink>
      <RouterLink to="/diet" @click="close">식단관리</RouterLink>
      <RouterLink to="/workout" @click="close">운동영상</RouterLink>
    </nav>

    <!-- 로그아웃 버튼 (하단 고정 바로 위) -->
    <!-- <button
      v-if="store.isLoggedIn"
      @click="handleLogout"
      class="absolute bottom-22 right-10 text-sm text-gray-500"
    >

      로그아웃
    </button> -->

    <!-- 하단 프로필 영역 (완전 고정) -->
    <div
      v-if="store.isLoggedIn"
      class="absolute bottom-0 left-0 w-full px-10 py-4 shadow-sm flex items-center justify-between"
    >
      <div class="flex items-center gap-5">
        <img
          :src="store.userInfo.profileImageUrl || profileImg"
          class="w-10 h-10 rounded-full object-cover"
        />
        <div class="flex flex-col">
          <span class="text-base text-gray-700 font-medium"> 환영합니다! </span>
          <span class="text-base text-gray-700 font-medium">
            {{ store.userInfo.nickname }}님
          </span>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <ArrowLeftStartOnRectangleIcon
          v-if="store.isLoggedIn"
          class="w-6 h-6 text-gray-600 cursor-pointer"
          @click="handleLogout"
        />
        <RouterLink to="/mypage" @click="close">
          <Cog6ToothIcon class="w-6 h-6 text-gray-600" />
        </RouterLink>
      </div>
    </div>

    <!-- 로그인 & 회원가입 (로그아웃이 아닐 때) -->
    <div
      v-else
      class="absolute bottom-6 w-full px-16 flex justify-between text-lg font-medium"
    >
      <RouterLink to="/auth/login" @click="close">로그인</RouterLink>
      <RouterLink to="/auth/signup" @click="close">회원가입</RouterLink>
    </div>
  </div>
</template>

<script setup>
import {
  XMarkIcon,
  Cog6ToothIcon,
  ArrowLeftStartOnRectangleIcon,
} from '@heroicons/vue/24/outline';
import { useAuthStore } from '@/stores/Auth';
import profileImg from '@/assets/profile.png';

const props = defineProps({
  open: Boolean,
  close: Function,
});

const store = useAuthStore();

const handleLogout = () => {
  store.logout();
  props.close();
};
</script>
