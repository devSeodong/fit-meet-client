<!-- /src/components/UserDropdown.vue -->
<template>
  <div class="relative" ref="dropdownRef">
    <!-- 프로필 원형 아이콘 -->
    <button
      @click="toggle"
      class="w-10 h-10 rounded-full overflow-hidden border"
    >
      이미지
      <!-- <img :src="user.profile_image" alt="profile" /> -->
    </button>

    <!-- 드롭다운 내용 -->
    <div
      v-if="visible"
      class="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border p-4 z-50"
    >
      <div class="flex items-center gap-3 mb-4">
        <img :src="user.profile_image" class="w-10 h-10 rounded-full border" />
        <div class="font-semibold">{{ user.nickname }}님</div>
      </div>

      <RouterLink
        to="/mypage"
        class="block py-2 hover:text-blue-600"
        @click="close"
      >
        마이페이지
      </RouterLink>

      <button
        class="w-full text-left py-2 text-red-500 hover:text-red-600"
        @click="logout"
      >
        로그아웃
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useUserStore } from '@/stores/User';

const store = useUserStore();
const user = store.userInfo;

const visible = ref(false);
const dropdownRef = ref(null);

const toggle = () => (visible.value = !visible.value);
const close = () => (visible.value = false);

const logout = () => {
  store.logout();
  close();
};

// 바깥 클릭 시 닫기
const handleClickOutside = e => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    close();
  }
};

onMounted(() => document.addEventListener('click', handleClickOutside));
onBeforeUnmount(() =>
  document.removeEventListener('click', handleClickOutside),
);
</script>

<style scoped></style>
