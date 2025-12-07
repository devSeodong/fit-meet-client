import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore('user', () => {
  // 사용자 기본 정보
  const user = ref({
    id: null,
    name: '',
    email: '',
    age: null,
    gender: '',
    height: null, // cm
    weight: null, // kg
  });

  // 사용자 정보 불러오기 (API 연동 가능)
  const setUser = userData => {
    user.value = { ...user.value, ...userData };
  };

  // 개별 필드 업데이트
  const updateField = (key, value) => {
    user.value[key] = value;
  };

  // 로그아웃 혹은 초기화
  const resetUser = () => {
    user.value = {
      id: null,
      name: '',
      email: '',
      age: null,
      gender: '',
      height: null,
      weight: null,
    };
  };

  return {
    user,
    setUser,
    updateField,
    resetUser,
  };
});
