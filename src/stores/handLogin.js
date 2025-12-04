import { defineStore } from 'pinia'
// 假设 '@/services/handLogin' 中的 getSelfData 接受环境链接作为参数
// 或者您需要调整 getSelfData 的实现来适应多环境请求
import { getSelfData } from '@/services/handLogin'; 
import { MessagePlugin } from 'tdesign-vue-next';

// 初始环境数据结构
const initialEnvState = {
    handAuth: {},           // Token信息
    handSelfData: {},       // 用户信息
    leftValidTime: 0,       // 剩余有效时间
    refreshTokenTimer: null,// 刷新Token定时器ID
    handEnvLink: '',        // 环境链接
};

// 默认支持的环境列表（您可以在调用时动态设置）
const initialEnvList = ['113', 'poc', 'gbg'];

// 创建初始 envData 状态
const createInitialEnvData = () => {
    return initialEnvList.reduce((acc, env) => {
        acc[env] = { ...initialEnvState };
        return acc;
    }, {});
};

export const useHandAuthStore = defineStore('handAuth', {
    state: () => ({
        name: 'handAuth',
        // 存储所有环境的数据，键为环境标识符 ('113', 'poc', 'gbg')
        envData: createInitialEnvData(),
        // 当前选中的环境，用于在页面上高亮和显示数据
        handEnv: '113', 
        redirectUrl: ''
    }),

    getters: {
        // 根据当前选中的环境获取数据
        currentEnvData: (state) => state.envData[state.handEnv] || initialEnvState,

        // 访问当前选中环境的 token/时间
        access_token: (state) => state.currentEnvData.handAuth.access_token,
        expires_in: (state) => state.currentEnvData.handAuth.expires_in,
        getDateTime: (state) => state.currentEnvData.handAuth.getDateTime,
        
        // 访问当前选中环境的 link
        handEnvLink: (state) => state.currentEnvData.handEnvLink,

        // 访问当前选中环境的 auth 对象
        handAuth: (state) => state.currentEnvData.handAuth,

        // 访问当前选中环境的 user data
        handSelfData: (state) => state.currentEnvData.handSelfData,

        // 访问当前选中环境的剩余时间
        leftValidTime: (state) => state.currentEnvData.leftValidTime
    },

    actions: {
        // ------------------------- 核心操作 Actions -------------------------
        
        /**
         * 设置重定向URL
         */
        setRedirectUrl(url) {
            this.redirectUrl = url;
        },

        /**
         * 设置指定环境的认证信息 (Auth Token)
         * @param {string} env 环境标识符
         * @param {Object} auth 认证对象
         */
        setHandAuth(env, auth) {
            if (!this.envData[env]) return; // 环境不存在则退出
            
            // 确保每个环境都有一个独立的 timer
            this.clearTimer(env); 
            
            this.envData[env].handAuth = {
                 ...auth,
                 getDateTime: new Date().getTime() // 记录获取时间
            };
            this.envData[env].leftValidTime = auth.expires_in || 0;
            this.startTimer(env);
            
            // 也可以选择将所有环境 token 存储在 localStorage 的不同键下，但这里选择交给 pinia-plugin-persist 统一管理
            // localStorage.setItem(`handAdminTokens_${env}`, JSON.stringify(auth));
        },

        /**
         * 设置当前选中的环境
         * @param {string} env 环境标识符
         */
        setHandEnv(env) {
            this.handEnv = env;
        },

        /**
         * 设置指定环境的链接
         * @param {string} env 环境标识符
         * @param {string} envLink 环境链接
         */
        setHandEnvLink(env, envLink) {
             if (!this.envData[env]) return;
             this.envData[env].handEnvLink = envLink;
        },
        
        /**
         * 清除指定环境的认证信息
         * @param {string} env 环境标识符
         */
        clearHandAuth(env) {
            if (!this.envData[env]) return;
            
            this.envData[env].handAuth = {};
            this.envData[env].handSelfData = {};
            this.envData[env].leftValidTime = 0;
            this.clearTimer(env);
            
            // 如果清除的是当前选中的环境，则尝试重新选中 '113' 或其他默认值
            if (this.handEnv === env) {
                 this.handEnv = initialEnvList[0];
            }
            // localStorage.removeItem(`handAdminTokens_${env}`);
        },
        
        /**
         * 设置指定环境的用户数据
         * @param {string} env 环境标识符
         * @param {Object} selfData 用户数据
         */
        setHandSelfData(env, selfData) {
            if (!this.envData[env]) return;
            this.envData[env].handSelfData = selfData;
        },

        // ------------------------- 定时器/时间计算 Actions -------------------------

        /**
         * 计算并更新指定环境的剩余有效时间
         * @param {string} env 环境标识符
         */
        setLeftValidTime(env) {
            const data = this.envData[env];
            if (!data || !data.handAuth.expires_in || !data.handAuth.getDateTime) {
                return;
            }
            const expiresIn = data.handAuth.expires_in;
            const getDateTime = data.handAuth.getDateTime;
            
            // 计算过期时间
            const leftValidTime = expiresIn - (new Date().getTime() - new Date(getDateTime).getTime()) / 1000;
            data.leftValidTime = leftValidTime > 0 ? leftValidTime : 0;

            if (leftValidTime <= 0) {
                this.clearHandAuth(env);
                MessagePlugin.warning(`${env} 环境登陆已过期，请重新登陆。`);
            }
        },

        /**
         * 启动指定环境的定时器
         * @param {string} env 环境标识符
         */
        startTimer(env) {
            if (!this.envData[env]) return;
            this.clearTimer(env); // 确保先清除旧的

            this.envData[env].refreshTokenTimer = setInterval(() => {
                this.setLeftValidTime(env);
            }, 1000);
        },

        /**
         * 清除指定环境的定时器
         * @param {string} env 环境标识符
         */
        clearTimer(env) {
            if (this.envData[env] && this.envData[env].refreshTokenTimer !== null) {
                clearInterval(this.envData[env].refreshTokenTimer);
                this.envData[env].refreshTokenTimer = null;
            }
        },

        // ------------------------- 异步请求 Actions -------------------------

        /**
         * 获取指定环境的用户数据
         * @param {string} env 环境标识符
         * @param {string} successMessage 成功提示
         * @param {string} failMessage 失败提示
         */
        async getUserInfo(env, successMessage, failMessage) {
            const data = this.envData[env];
            if (!data || !data.handAuth.access_token) {
                MessagePlugin.info(`${env} 环境未登陆`);
                return;
            }
            
            // 可以在这里设置请求头
            // const currentAccessToken = data.handAuth.access_token;
            // const currentEnvLink = data.handEnvLink;
            
            try {
                // 注意：getSelfData 需要能够使用当前环境的链接和 token 进行请求
                const response = await getSelfData(/* currentEnvLink, currentAccessToken */); 
                
                if (response) {
                    this.setHandSelfData(env, response);
                    successMessage && MessagePlugin.success(successMessage)
                }
            } catch (error) {
                console.error(`获取 ${env} 用户数据失败:`, error);
                // 可能是 token 过期，清除状态
                this.clearHandAuth(env);
                failMessage && MessagePlugin.error(failMessage)
            }
        },
    },
    // 假设您使用了 pinia-plugin-persist 插件
    persist: true, 
})