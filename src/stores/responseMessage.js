import { defineStore } from 'pinia';
import responseMessageService from '@/services/responseMessage';
import { MessagePlugin } from 'tdesign-vue-next';
import handRequest from '@/utils/requestHand';

export const useMessageStore = defineStore('responseMessage', {
    state: () => ({
        // 环境列表数据
        messageList: [],
        // 环境详情数据
        messageDetail: null,
        // 环境
        env: null,
        // 分页信息
        pagination: {
            page: 1,
            pageSize: 10,
            total: 0
        },
        // 加载状态
        loading: false,
        // 抽屉可见状态
        drawerVisible: false,
        // 当前操作类型：add或edit
        currentAction: '',
        // 当前编辑的环境ID
        currentMessageId: null,
        // 查询参数
        queryParams: {}
    }),

    getters: {
        // 计算属性，用于获取当前环境
        currentMessage: (state) => {
            return state.messageDetail;
        }
    },

    actions: {
        // 设置环境
        setEnv(env) {
            this.env = env;
        },
        // 设置查询参数
        setQueryParams(params) {
            this.queryParams = { ...this.queryParams, ...params };
        },

        // 重置查询参数
        resetQueryParams() {
            this.queryParams = {};
        },

        // 分页页码变化
        changePage(page) {
            this.pagination.page = page;
            console.log('changePage', this.pagination.page);
            this.fetchMessageList();
        },

        // 分页大小变化
        changePageSize(pageSize) {
            this.pagination.pageSize = pageSize;
            this.fetchMessageList();
        },

        // 打开添加抽屉
        openAddDrawer() {
            this.drawerVisible = true;
            this.currentAction = 'add';
        },

        // 打开编辑抽屉
        async openEditDrawer(id) {
            this.loading = true;
            try {
                this.currentAction = 'edit';
                this.currentMessageId = id;
                // 获取详情
                await this.getDetail(id);
                this.drawerVisible = true;
            } catch (error) {
                console.error('打开编辑抽屉失败:', error);
            } finally {
                this.loading = false;
            }
        },

        // 关闭抽屉
        closeDrawer() {
            this.drawerVisible = false;
            this.currentAction = '';
            this.currentMessageId = null;
        },

        // 获取环境列表
        async fetchMessageList() {
            this.loading = true;
            try {
                const params = { ...this.queryParams, page: this.pagination.page - 1, size: this.pagination.pageSize };
                const response = await responseMessageService.queryCommonLansResponseData(params, this.env);
                // 处理返回数据
                this.messageList = response.content || [];
                this.pagination.total = response.totalElements || 0;
            } catch (error) {
                console.error('获取环境列表失败:', error);
                MessagePlugin.error('获取环境列表失败');
            } finally {
                this.loading = false;
            }
        },

        // 获取环境详情
        async getDetail(id) {
            try {
                const response = await responseMessageService.getMessageDetail(id);
                this.messageDetail = response.data;
                return this.messageDetail;
            } catch (error) {
                console.error('获取环境详情失败:', error);
                MessagePlugin.error('获取环境详情失败');
                return null;
            }
        },

        // 添加新环境
        async addMessage(messageData, env, translateLangsMap) {
            const translateLangsMapNew = { zh_CN: 'cn',...translateLangsMap };
            try {
                for (const lang in translateLangsMapNew) {
                    if (messageData[lang]) {
                        const code = messageData.code;
                        const description = messageData[lang];
                        const type = messageData.type;
                        const response = await responseMessageService.addNewMessage({ code, description, lang, type }, env);
                        if (response.messageId) {
                            MessagePlugin.success(`添加${lang}成功`);
                        }
                    }
                }
                // 刷新列表
                await this.fetchMessageList();
                this.closeDrawer();
            } catch (error) {
                console.error('添加环境失败:', error);
                MessagePlugin.error('添加环境失败');
                return null;
            }
        },

        // 更新环境
        async updateMessage(id, messageData) {
            try {
                const response = await responseMessageService.updateExistingMessage(id, messageData);
                if (response.status === 'success') {
                    MessagePlugin.success('更新环境成功');
                    // 刷新列表
                    await this.fetchMessageList();
                    this.closeDrawer();
                }
                return response;
            } catch (error) {
                console.error('更新环境失败:', error);
                MessagePlugin.error('更新环境失败');
                return null;
            }
        },

        // 删除环境
        async deleteMessage(selectedMessage, env) {
            try {
                const response = await responseMessageService.deleteExistingMessage(selectedMessage, env);
                if (!response) {
                    MessagePlugin.success('删除环境成功');
                    // 刷新列表
                    await this.fetchMessageList();
                }
                return response;
            } catch (error) {
                console.error('删除环境失败:', error);
                MessagePlugin.error('删除环境失败');
                return null;
            }
        },

        // 批量删除环境
        async batchDeleteMessage(ids) {
            try {
                const response = await responseMessageService.batchDeleteMessage(ids);
                if (response.status === 'success') {
                    MessagePlugin.success('批量删除环境成功');
                    // 刷新列表
                    await this.fetchMessageList();
                }
                return response;
            } catch (error) {
                console.error('批量删除环境失败:', error);
                MessagePlugin.error('批量删除环境失败');
                return null;
            }
        },

        // 刷新环境列表
        async refreshMessageList() {
            await this.fetchMessageList();
        }
    }
});