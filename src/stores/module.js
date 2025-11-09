import { defineStore } from 'pinia';
import { getModuleList, getModule, addModule, updateModule, deleteModule } from '../services/module';

export const useModuleStore = defineStore('module', {
  persist: true,
  state: () => ({
    // 模块列表数据
    moduleList: [],
    // 单个模块详情
    moduleDetail: null,
    // 查询参数
    queryParams: {
      module_name: '',
      module_code: '',
      status: null,
      project_id: null,
      page: 1,
      pageSize: 10,
      user_id: null
    },
    // 分页信息
    pagination: {
      total: 0,
      page: 1,
      pageSize: 10,
      totalPages: 0
    },
    // 加载状态
    loading: false,
    // 抽屉状态
    drawerVisible: false,
    // 当前操作类型：add 或 edit
    currentAction: 'add',
    // 当前编辑的模块ID
    currentModuleId: null
  }),

  getters: {
    // 获取当前页的模块列表
    currentPageModules: (state) => {
      return state.moduleList;
    },
    // 获取查询条件
    getQueryParams: (state) => {
      return state.queryParams;
    }
  },

  actions: {
    // 设置查询参数
    setQueryParams(params) {
      this.queryParams = { ...this.queryParams, ...params };
    },

    // 重置查询参数
    resetQueryParams() {
      this.queryParams = {
        module_name: '',
        module_code: '',
        status: null,
        project_id: null,
        page: 1,
        pageSize: 10,
        user_id: null
      };
    },

    // 获取模块列表
    async fetchModuleList() {
      this.loading = true;
      console.log('this.queryParams', this.queryParams);
      try {
        const response = await getModuleList(this.queryParams);
        if (response.data) {
          this.moduleList = response.data.list || [];
          this.pagination = {
            total: response.data.total || 0,
            page: response.data.page || 1,
            pageSize: response.data.pageSize || 10,
            totalPages: response.data.totalPages || 0
          };
        }
        return response;
      } catch (error) {
        console.error('获取模块列表失败:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 获取模块详情
    async fetchModuleDetail(id) {
      try {
        const response = await getModule(id);
        if (response.data) {
          this.moduleDetail = response.data;
        }
        return response;
      } catch (error) {
        console.error('获取模块详情失败:', error);
        throw error;
      }
    },

    // 添加模块
    async addNewModule(data) {
      try {
        // 添加用户ID
        if (this.queryParams.user_id) {
          data.user_id = this.queryParams.user_id;
        }
        const response = await addModule(data);
        // 添加成功后刷新列表
        await this.fetchModuleList();
        return response;
      } catch (error) {
        console.error('添加模块失败:', error);
        throw error;
      }
    },

    // 更新模块
    async updateExistingModule(id, data) {
      try {
        // 添加用户ID
        if (this.queryParams.user_id) {
          data.user_id = this.queryParams.user_id;
        }
        const response = await updateModule(id, data);
        // 更新成功后刷新列表
        await this.fetchModuleList();
        return response;
      } catch (error) {
        console.error('更新模块失败:', error);
        throw error;
      }
    },

    // 删除模块
    async deleteExistingModule(id) {
      try {
        const response = await deleteModule(id);
        // 删除成功后刷新列表
        await this.fetchModuleList();
        return response;
      } catch (error) {
        console.error('删除模块失败:', error);
        throw error;
      }
    },

    // 打开添加抽屉
    openAddDrawer() {
      this.currentAction = 'add';
      this.moduleDetail = null;
      this.drawerVisible = true;
    },

    // 打开编辑抽屉
    async openEditDrawer(id) {
      this.currentAction = 'edit';
      this.currentModuleId = id;
      try {
        await this.fetchModuleDetail(id);
        this.drawerVisible = true;
      } catch (error) {
        console.error('打开编辑抽屉失败:', error);
      }
    },

    // 关闭抽屉
    closeDrawer() {
      this.drawerVisible = false;
      this.moduleDetail = null;
      this.currentModuleId = null;
    },

    // 切换页码
    async changePage(page) {
      this.queryParams.page = page;
      console.log('this.queryParams', this.queryParams);
      await this.fetchModuleList();
    },

    // 切换每页数量
    async changePageSize(pageSize) {
      this.queryParams.pageSize = pageSize;
      this.queryParams.page = 1; // 重置为第一页
      await this.fetchModuleList();
    },

    // 按模块名称搜索
    async searchByName(module_name) {
      this.queryParams.module_name = module_name;
      this.queryParams.page = 1; // 重置为第一页
      await this.fetchModuleList();
    },

    // 按模块编码搜索
    async searchByCode(module_code) {
      this.queryParams.module_code = module_code;
      this.queryParams.page = 1; // 重置为第一页
      await this.fetchModuleList();
    },

    // 按状态筛选
    async filterByStatus(status) {
      this.queryParams.status = status !== '' ? status : null;
      this.queryParams.page = 1; // 重置为第一页
      await this.fetchModuleList();
    },

    // 按项目ID筛选
    async filterByProject(project_id) {
      this.queryParams.project_id = project_id !== '' ? project_id : null;
      this.queryParams.page = 1; // 重置为第一页
      await this.fetchModuleList();
    },

    // 刷新列表
    async refreshList() {
      await this.fetchModuleList();
    }
  }
});