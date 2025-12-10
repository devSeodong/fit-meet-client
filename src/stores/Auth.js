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
    // 회원가입
    async createUser(payload) {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/auth/signup`,
          payload,
        );
        return res.data;
      } catch (err) {
        console.log(err.response);
        if (err.response) {
          // ❗ 여기서 throw 해야 catch로 넘어감
          throw err.response.data;
        } else {
          throw err;
        }
      }
    },

    // 로그인
    async getLogin(payload) {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/auth/login`,
          payload,
          { withCredentials: true },
        );

        if (res.data.code === 0) {
          this.isLoggedIn = true;
          // this.userInfo = res.data.data;

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

    // 이메일 중복 체크
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

    // 사용자 정보 조회 (/api/auth/me)
    async fetchUserInfo() {
      this.loadingUser = true;

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/user/profile-info`,
          { withCredentials: true },
        );

        if (res.data.code === 0) {
          this.userInfo = {
            nickname: res.data.data.nickname,
            profileImageUrl: res.data.data.profileImageUrl,
          };
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
          alert(res.data.data);
        }
      } catch (err) {
        console.log(err);
        console.log('로그아웃에 실패했습니다!');
      }
    },
  },
});
