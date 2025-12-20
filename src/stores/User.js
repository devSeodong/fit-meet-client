import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';
import { useAuthStore } from './Auth';

export const useUserStore = defineStore('user', () => {
  // === STATE (상태) ===
  const healthInfo = ref({
    height_cm: null,
    weight_kg: null,
    target_weight_kg: null,
    gender: null,
    birth_date: null,
    activity_level: null,
  });
  const loading = ref(false);

  // === GETTERS (계산된 상태) ===
  // 신체 정보가 필수적으로 입력되었는지 확인
  const isHealthInfoMissing = computed(() => {
    const requiredFields = [
      healthInfo.value.height_cm,
      healthInfo.value.weight_kg,
      healthInfo.value.gender,
    ];
    return requiredFields.some(
      value => value === null || value === 0 || value === undefined,
    );
  });

  // 사용자 신장 정보
  const userHeight = computed(() => healthInfo.value.height_cm);

  // === ACTIONS (함수) ===
  // 서버에서 가져온 데이터로 healthInfo 상태 업데이트 (Setter 역할)
  function setHealthInfoFromFetch(userData) {
    healthInfo.value = {
      height_cm: userData.heightCm,
      weight_kg: userData.weightKg,
      target_weight_kg: userData.targetWeightKg,
      gender: userData.gender,
      birth_date: userData.birthDate,
      activity_level: userData.activityLevel,
    };
  }

  // 프로필(신체 및 닉네임) 수정 (/api/user/profile-upt)
  async function updateUserProfileInfo(payload) {
    loading.value = true;
    const authStore = useAuthStore();

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/profile-upt`,
        payload,
        { withCredentials: true },
      );

      if (res.data.code === 0) {
        // AuthStore의 userInfo 업데이트
        authStore.userInfo.nickname = payload.nickname;
        // UserStore의 healthInfo 업데이트 (Setter 사용)
        setHealthInfoFromFetch(payload);
        return res.data;
      } else {
        throw new Error(res.data.msg || '프로필 수정에 실패했습니다.');
      }
    } catch (err) {
      console.error('프로필 수정 실패:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // 프로필 이미지 수정 (/api/user/profile-image)
  async function updateUserProfileImg(formData) {
    loading.value = true;
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/profile-image`,
        formData,
        {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      );

      if (res.data.code === 0) {
        const newImageUrl = res.data.data;
        const authStore = useAuthStore();
        // AuthStore의 프로필 이미지 URL 업데이트
        authStore.userInfo.profileImageUrl = newImageUrl;
        return newImageUrl;
      } else {
        throw new Error(res.data.msg || '이미지 업로드에 실패했습니다.');
      }
    } catch (err) {
      console.error('프로필 이미지 수정 실패:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // 프로필 이미지 삭제 (/api/user/profile-image)
  async function deleteUserProfileImg() {
    loading.value = true;
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/user/profile-image`,
        { withCredentials: true },
      );

      if (res.data.code === 0) {
        const authStore = useAuthStore();
        authStore.userInfo.profileImageUrl = '';
        return res.data;
      } else {
        throw new Error(res.data.msg || '이미지 삭제에 실패했습니다.');
      }
    } catch (err) {
      console.error('프로필 이미지 삭제 실패:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // 비밀번호 변경 (/api/user/password-upt)
  async function updatePassword(payload) {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/password-upt`,
        payload,
        { withCredentials: true },
      );
      return res.data;
    } catch (err) {
      return err.response.data;
    }
  }

  // 첫 신체정보 입력 (폐기됨) (/api/user/insert-body)
  async function submitBodyProfileInfo() {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/insert-body`,
        healthInfo.value,
        { withCredentials: true },
      );

      if (res.data && res.data.code === 0) {
        return '등록에 성공하셨습니다! 환영합니다!';
      } else {
        throw new Error(
          res.data.msg || '정보 등록에 실패했습니다. (서버 내부 오류)',
        );
      }
    } catch (err) {
      console.error('프로필 전송 실패:', err);
      throw new Error('서버와의 통신에 실패했습니다. 다시 시도해 주세요.');
    }
  }

  return {
    // State
    healthInfo,
    loading,

    // Getters
    isHealthInfoMissing,
    userHeight,

    // Actions
    setHealthInfoFromFetch,
    updateUserProfileInfo,
    updateUserProfileImg,
    deleteUserProfileImg,
    updatePassword,
    submitBodyProfileInfo,
  };
});
