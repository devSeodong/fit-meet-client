// /src/store/User.js
import { defineStore } from 'pinia';
import axios from 'axios';
import router from '@/router';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    userInfo: {
      nickname: '',
      profileImageUrl: '',
    },
    isLoggedIn: false,
    loadingUser: true, // 앱 로딩 시 사용자 정보 불러오는 중
  }),

  actions: {
    // 회원가입(/api/auth/signup)
    async createUser(payload) {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/auth/signup`,
          payload,
        );

        return res.data;
      } catch (err) {
        // 서버 응답이 있는 경우 → 예외 던지기
        if (err.response?.data) {
          throw err.response.data; // ❗ 성공처럼 return하면 안 됨
        }

        throw err; // 진짜 네트워크 에러
      }
    },

    // 로그인(/api/auth/login)
    async getLogin(payload) {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/auth/login`,
          payload,
          { withCredentials: true },
        );

        if (res.data.code === 0) {
          this.isLoggedIn = true;

          // 로그인 후 사용자 정보 가져오기
          await this.fetchUserInfo();
        }

        return res.data;
      } catch (err) {
        if (err.response) {
          return err.response?.data;
        } else {
          throw err.response?.data || err;
        }
      }
    },

    // 이메일 중복 체크(/api/auth/email-info)
    async checkEmail(email) {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/auth/email-info`,
          { params: { email } },
        );
        return { available: true };
      } catch (err) {
        const msg = err.response?.data?.msg;
        return { available: false, message: msg };
      }
    },

    // 사용자 정보 조회 (/api/user/profile-info)
    async fetchUserInfo() {
      this.loadingUser = true;

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/user/profile-info`,
          { withCredentials: true },
        );
        console.log('fetchUserInfo res:: ', res);

        if (res.data.code === 0) {
          const userData = res.data.data;
          this.userInfo = {
            nickname: userData.nickname,
            profileImageUrl: userData.profileImageUrl,
          };
          console.log(this.userInfo);
          this.isLoggedIn = true;
          return true; // 성공
        } else {
          this.userInfo = null;
          this.isLoggedIn = false;
          return false; // 실패
        }
      } catch (err) {
        this.userInfo = null;
        this.isLoggedIn = false;
        return false;
      } finally {
        this.loadingUser = false;
      }
    },

    //비밀번호 재설정하는 메일 전송 (/api/auth/password-reset/request)
    async requestPasswordReset(email) {
      try {
        console.log(email);
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/auth/password-reset/request`,
          { email: email },
          { withCredentials: true },
        );

        if (res.status === 200) {
          console.log('비밀번호 재설정 메일 요청 성공');

          return {
            success: true,
            message:
              '비밀번호 재설정 메일이 발송되었습니다. 메일함을 확인해주세요.',
          };
        }
      } catch (err) {
        console.error('비밀번호 재설정 요청 중 오류 발생:', err);

        if (err.response) {
          console.error('서버 응답 상태 코드:', err.response.status);
          // 🚨 이 부분이 핵심: 서버가 400 응답 시 보낸 본문 내용을 확인
          console.error(
            '서버 응답 데이터 (400 오류 메시지):',
            err.response.data,
          );
        }

        // ... (기존 throw 로직 유지) ...
        throw {
          status: err.response?.status || 'Network Error',
          message: errorMessage,
        };
      }
    },

    //비밀번호 재설정 토큰 유효성검사 (/api/auth/password-reset/validate)
    async validatePasswordReset(token) {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/auth/password-reset/validate`,
          { params: { token: token } },
          // { withCredentials: true },
        );
        console.log('token validate :: ', res);
        return res;
      } catch (err) {
        return err.response.data;
      }
    },

    //비밀번호 재설정 (/api/auth/password-reset/confirm)
    async confirmPasswordReset(payload) {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/auth/password-reset/confirm`,
          payload,
          { withCredentials: true },
        );
        console.log('token confirm :: ', res);
        return res.data;
      } catch (err) {
        return err.response.data;
      }
    },

    // 로그아웃
    async logout() {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/auth/logout`,
          {},
          {
            withCredentials: true,
          },
        );
        console.log('로그아웃이 됬나?::', res);

        if (res.data.code === 0) {
          this.userInfo = null;
          this.isLoggedIn = false;
          alert(res.data.msg);
        }
      } catch (err) {
        console.log(err);
        console.log('로그아웃에 실패했습니다!');
      }
    },
  },
});
