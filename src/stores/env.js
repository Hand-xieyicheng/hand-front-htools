import { defineStore } from 'pinia';
import envService from '@/services/env';
import { MessagePlugin } from 'tdesign-vue-next';
/**
 * 环境信息状态管理
 */
export const useEnvStore = defineStore('env', {
  persist: true,
  state: () => ({
    // 环境列表数据
    envList: [],
    // 当前操作（'add' 或 'edit'）
    currentAction: 'add',
    // 当前编辑的环境ID
    currentEnvId: null,
    // 环境详情
    envDetail: null,
    // 抽屉可见性
    drawerVisible: false,
    // 加载状态
    loading: false,
    // 查询参数
    queryParams: {
      page: 1,
      pageSize: 10,
      env_name: '',
      env_code: '',
      status: '',
      is_public: ''
    },
    // 分页信息
    pagination: {
      total: 0,
      page: 1,
      pageSize: 10
    }
  }),

  actions: {
    /**
     * 获取环境列表
     */
    async fetchEnvList() {
      try {
        this.loading = true;
        const response = await envService.getEnvList(this.queryParams);
        if (response.status === "success") {
          this.envList = response.data.list || [];
          this.pagination = {
            total: response.data.total || 0,
            page: response.data.page || 1,
            pageSize: response.data.pageSize || 10
          };
        }

        return response;
      } catch (error) {
        console.error('获取环境列表失败:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * 获取环境详情
     * @param {Number} id - 环境ID
     */
    async fetchEnvDetail(id) {
      try {
        this.loading = true;
        const response = await envService.getEnvDetail(id);

        if (response.status === "success" && response.data) {
          this.envDetail = response.data;
        }

        return response;
      } catch (error) {
        console.error('获取环境详情失败:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * 添加新环境
     * @param {Object} envData - 环境数据
     */
    async addNewEnv(envData) {
      try {
        this.loading = true;
        const response = await envService.addEnv(envData);
        if (response.status === "success") {
          // 添加成功后刷新列表
          await this.fetchEnvList();
        }

        return response;
      } catch (error) {
        console.error('添加环境失败:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * 更新现有环境
     * @param {Number} id - 环境ID
     * @param {Object} envData - 环境数据
     */
    async updateExistingEnv(id, envData) {
      try {
        this.loading = true;
        const response = await envService.updateEnv(id, envData);

        if (response.status === "success") {
          // 更新成功后刷新列表
          MessagePlugin.success('更新成功');
          await this.fetchEnvList();
        }

        return response;
      } catch (error) {
        MessagePlugin.error('更新环境失败');
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * 删除环境
     * @param {Number} id - 环境ID
     */
    async deleteExistingEnv(id) {
      try {
        this.loading = true;
        const response = await envService.deleteEnv(id);

        if (response.code === 200) {
          // 删除成功后刷新列表
          await this.fetchEnvList();
        }

        return response;
      } catch (error) {
        console.error('删除环境失败:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * 打开添加抽屉
     */
    openAddDrawer() {
      this.currentAction = 'add';
      this.currentEnvId = null;
      this.envDetail = null;
      this.drawerVisible = true;
    },

    /**
     * 打开编辑抽屉
     * @param {Number} id - 环境ID
     */
    async openEditDrawer(id) {
      this.currentAction = 'edit';
      this.currentEnvId = id;
      this.drawerVisible = true;
      await this.fetchEnvDetail(id);
    },

    /**
     * 关闭抽屉
     */
    closeDrawer() {
      this.drawerVisible = false;
      this.envDetail = null;
    },

    /**
     * 设置查询参数
     * @param {Object} params - 查询参数
     */
    setQueryParams(params) {
      this.queryParams = { ...this.queryParams, ...params };
    },

    /**
     * 重置查询参数
     */
    resetQueryParams() {
      this.queryParams = {
        page: 1,
        pageSize: 10,
        env_name: '',
        env_code: '',
        status: '',
        is_public: ''
      };
    },

    /**
     * 按状态筛选
     * @param {Number|String} status - 状态值
     */
    filterByStatus(status) {
      this.queryParams.status = status;
      this.fetchEnvList();
    },

    /**
     * 更改页码
     * @param {Number} page - 页码
     */
    changePage(page) {
      this.queryParams.page = page;
      this.fetchEnvList();
    },

    /**
     * 更改每页数量
     * @param {Number} pageSize - 每页数量
     */
    changePageSize(pageSize) {
      this.queryParams.pageSize = pageSize;
      this.fetchEnvList();
    }
  }
});