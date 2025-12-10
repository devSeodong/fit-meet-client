import { defineStore } from 'pinia';
import axios from 'axios';

export const useUserStore = defineStore('user', {
  state: () => ({
    healthInfo: {
      height_cm: null,
      weight_kg: null,
      target_weight_kg: null,
      gender: null,
      birth_date: null,
      activity_level: null,
    },
  }),

  actions: {
    // useUserStore.js (store 파일)

    async submitBodyProfileInfo() {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/user/insert-body`,
          this.healthInfo,
          {
            withCredentials: true,
          },
        );

        // 서버 응답이 200 OK이고, 내부적으로 성공 코드(예: code === 0)를 반환할 때
        if (res.data && res.data.code === 0) {
          // 성공 메시지 반환
          return '등록에 성공하셨습니다! 환영합니다!';
        } else {
          // 200 OK를 받았지만 서버 로직상 실패한 경우 (예외 처리)
          throw new Error(
            res.data.msg || '정보 등록에 실패했습니다. (서버 내부 오류)',
          );
        }
      } catch (err) {
        console.error('프로필 전송 실패:', err);

        // 403, 네트워크 오류 등 모든 에러를 포괄하여 단순화된 메시지로 던짐
        if (err.response && err.response.status === 403) {
          throw new Error(
            '정보 등록 권한이 부족하거나 유효성 검사에 실패했습니다.',
          );
        }

        // 기타 네트워크 또는 서버 오류
        throw new Error('서버와의 통신에 실패했습니다. 다시 시도해 주세요.');
      }
    },
  },
});
