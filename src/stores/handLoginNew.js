import { defineStore } from 'pinia'
// 假设 '@/services/handLogin' 中的 getSelfData 接受环境链接作为参数
// 或者您需要调整 getSelfData 的实现来适应多环境请求
import { getSelfData } from '@/services/handLogin';
import { MessagePlugin } from 'tdesign-vue-next';
import envService from '@/services/env';

// envItem的数据结构定义
const envItem = {
    id: 0,              // 环境ID
    env_name: '',           // 环境名称
    env_code: '',           // 环境编码
    env_img_url: '',        // 环境图标URL
    login_url: '',          // 登录URL
    remark: '',           // 备注
    access_token: '',           // 访问Token
    refresh_token: '',           // 刷新Token
    active: false,           // 激活状态
    loading: false,           // 加载状态
}

export const useHandAuthStoreNew = defineStore('handAuthNew', {
    state: () => ({
        name: 'handAuthNew',
        // 存储所有环境的数据，键为环境标识符 ('113', 'poc', 'gbg')
        redirectUrl: '',
        envList: [],            // 环境列表
        currentEnvItem: {},        // 当前环境项
    }),

    getters: {
        envOptions: (state) => state.envList.filter(item => item.active).map(item => ({
            label: item.env_name,
            value: item.id,
        })),
    },

    actions: {
        // ------------------------- 核心操作 Actions -------------------------
        /**
         * 设置环境列表
         */
        setEnvList(envList) {
            this.envList = envList || [];
        },
        /**
         * 设置当前环境
         * @param {string} env 环境标识符
         */
        setCurrentEnv(env) {
            this.currentEnvItem = this.envList.find(item => item.id === env) || {};
        },
        /**
         * 获取环境列表
         */
        async getEnvList() {
            try {
                const response = await envService.getEnvList();
                if (response.status === "success") {
                    let data = response?.data?.list?.map(item => ({
                        ...envItem,
                        ...this.envList.find(env => env.id === item.id) || {},
                        ...item,
                    })) || [];
                    this.setEnvList(data);
                }
                return response;
            } catch (error) {
                console.error('获取环境列表失败:', error);
                throw error;
            }
        },
        // 根据环境id获取环境信息
        getEnvItemById(envId) {
            return this.envList.find(item => item.id === envId) || {};
        },
        // ------------------------- 异步请求 Actions -------------------------

        /**
         * 获取指定环境的用户数据
         * @param {string} envItem 环境标识符
         * @param {string} successMessage 成功提示
         * @param {string} failMessage 失败提示
         */
        async getUserInfo(envItem, successMessage, failMessage) {
            envItem.loading = true;
            const data = envItem;
            if (!data || !data.access_token) {
                MessagePlugin.info(`${envItem.env_name} 环境未登陆`);
                return;
            }

            // 可以在这里设置请求头
            // const currentAccessToken = data.handAuth.access_token;
            // const currentEnvLink = data.handEnvLink;
            try {
                this.currentEnvItem = data;
                // 注意：getSelfData 需要能够使用当前环境的链接和 token 进行请求
                const response = await getSelfData(/* currentEnvLink, currentAccessToken */);
                if (response) {
                    envItem.selfData = response;
                    envItem.active = true;
                    successMessage && MessagePlugin.success(successMessage)
                }
            } catch (error) {
                console.error(`获取 ${envItem.env_name} 用户数据失败:`, error);
                // 可能是 token 过期，清除状态
                this.clearCurrentAuth();
                envItem.active = false;
                failMessage && MessagePlugin.error(failMessage)
            } finally {
                envItem.loading = false;
            }
        },
        /**
         * 清除当前环境的认证信息
         */
        clearCurrentAuth() {
            this.envList.forEach(item => {
                if (item.id === this.currentEnvItem.id) {
                    item.active = false;
                    item.selfData = {};
                    item.access_token = '';
                    item.refresh_token = '';
                }
            });
            // 清空当前环境项
            this.currentEnvItem = {};
        },
        /**
         * 设置环境数据
         * @param {string} env 环境标识符
         * @param {Object} envData 环境数据
         */
        setHandEnvData(envData) {
            const index = this.envList.findIndex(item => item.id === Number(envData.env));
            if (index !== -1) {
                this.envList[index] = {
                    ...this.envList[index],
                    ...envData
                };
            }
            // 获取self数据
            this.getUserInfo(this.envList[index], `${this.envList[index].env_name} 环境数据设置成功`, `${this.envList[index].env_name} 环境数据设置失败`);
        },
    },
    // 假设您使用了 pinia-plugin-persist 插件
    persist: true,
})