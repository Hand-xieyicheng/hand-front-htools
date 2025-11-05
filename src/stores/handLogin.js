import { defineStore } from 'pinia'
import { getSelfData } from '@/services/handLogin';
import { MessagePlugin } from 'tdesign-vue-next';
export const useHandAuthStore = defineStore('handAuth', {
  state: () => ({
    name: 'handAuth', token: '', refreshToken: '', handEnv: '', handAuth: {}, handSelfData: {}, leftValidTime: 0, refreshTokenTimer: null,
    redirectUrl: ''
  }),
  getters: {
    access_token: (state) => state.handAuth.access_token,
    expires_in: (state) => state.handAuth.expires_in,
    getDateTime: (state) => state.handAuth.getDateTime
  },
  actions: {
    // 设置token
    setToken(token) {
      this.token = token;
    },
    // 设置refreshToken
    setRefreshToken(refreshToken) {
      this.refreshToken = refreshToken;
    },
    // 设置重定向URL
    setRedirectUrl(url) {
      this.redirectUrl = url;
    },
    setHandAuth(auth) {
      this.handAuth = auth;
      // 登录成功后，将token存储到localStorage
      localStorage.setItem('handAdminTokens', JSON.stringify(auth));
    },
    setHandEnv(env) {
      this.handEnv = env;
    },
    clearHandAuth() {
      this.handAuth = {};
      this.token = '';
      this.handSelfData = {};
      this.leftValidTime = 0;
      this.clearTimer();
      localStorage.removeItem('handAdminTokens');
    },
    setLeftValidTime() {
      // 计算过期时间
      if (!this.expires_in || !this.getDateTime) {
        return;
      }
      const expiresIn = this.expires_in;
      const getDateTime = this.getDateTime;
      const leftValidTime = expiresIn - (new Date() - new Date(getDateTime)) / 1000;
      this.leftValidTime = leftValidTime;
      if (leftValidTime <= 0) {
        this.clearHandAuth();
      }
    },
    // 启动定时器
    startTimer() {
      this.refreshTokenTimer = setInterval(() => {
        this.setLeftValidTime();
      }, 1000);
    },
    // 清除定时器
    clearTimer() {
      clearInterval(this.refreshTokenTimer);
    },
    // 设置用户数据
    setHandSelfData(selfData) {
      this.handSelfData = selfData;
    },
    // 获取用户数据
    async getUserInfo(successMessage, failMessage) {
      if (!this.access_token) {
        MessagePlugin.info("环境未登陆");
        return;
      }
      try {
        const response = await getSelfData();
        console.log('获取用户数据:', response);
        if (response) {
          this.setHandSelfData(response);
          successMessage && MessagePlugin.success(successMessage)
        }
      } catch (error) {
        console.error('获取用户数据失败:', error);
        failMessage && MessagePlugin.error(failMessage)
      }
    },
  },
  persist: true,
})