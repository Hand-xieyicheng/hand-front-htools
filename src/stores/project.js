import { defineStore } from 'pinia';
import { getProjectList, getProject, addProject, updateProject, deleteProject } from '../services/project';

export const useProjectStore = defineStore('project', {
  persist: true,
  state: () => ({
    // 项目列表数据
    projectList: [],
    // 单个项目详情
    projectDetail: null,
    // 查询参数
    queryParams: {
      project_name: '',
      project_code: '',
      status: null,
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
    // 当前编辑的项目ID
    currentProjectId: null
  }),

  getters: {
    // 获取当前页的项目列表
    currentPageProjects: (state) => {
      return state.projectList;
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
        project_name: '',
        project_code: '',
        status: null,
        page: 1,
        pageSize: 10,
        user_id: null
      };
    },

    // 获取项目列表
    async fetchProjectList() {
      this.loading = true;
      console.log('this.queryParams', this.queryParams);
      try {
        const response = await getProjectList(this.queryParams);
        if (response.data) {
          this.projectList = response.data.list || [];
          this.pagination = {
            total: response.data.total || 0,
            page: response.data.page || 1,
            pageSize: response.data.pageSize || 10,
            totalPages: response.data.totalPages || 0
          };
        }
        return response;
      } catch (error) {
        console.error('获取项目列表失败:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 获取项目详情
    async fetchProjectDetail(id) {
      try {
        const response = await getProject(id);
        if (response.data) {
          this.projectDetail = response.data;
        }
        return response;
      } catch (error) {
        console.error('获取项目详情失败:', error);
        throw error;
      }
    },

    // 添加项目
    async addNewProject(data) {
      try {
        // 添加用户ID
        if (this.queryParams.user_id) {
          data.user_id = this.queryParams.user_id;
        }
        const response = await addProject(data);
        // 添加成功后刷新列表
        await this.fetchProjectList();
        return response;
      } catch (error) {
        console.error('添加项目失败:', error);
        throw error;
      }
    },

    // 更新项目
    async updateExistingProject(id, data) {
      try {
        // 添加用户ID
        if (this.queryParams.user_id) {
          data.user_id = this.queryParams.user_id;
        }
        const response = await updateProject(id, data);
        // 更新成功后刷新列表
        await this.fetchProjectList();
        return response;
      } catch (error) {
        console.error('更新项目失败:', error);
        throw error;
      }
    },

    // 删除项目
    async deleteExistingProject(id) {
      try {
        const response = await deleteProject(id);
        // 删除成功后刷新列表
        await this.fetchProjectList();
        return response;
      } catch (error) {
        console.error('删除项目失败:', error);
        throw error;
      }
    },

    // 打开添加抽屉
    openAddDrawer() {
      this.currentAction = 'add';
      this.projectDetail = null;
      this.drawerVisible = true;
    },

    // 打开编辑抽屉
    async openEditDrawer(id) {
      this.currentAction = 'edit';
      this.currentProjectId = id;
      try {
        await this.fetchProjectDetail(id);
        this.drawerVisible = true;
      } catch (error) {
        console.error('打开编辑抽屉失败:', error);
      }
    },

    // 关闭抽屉
    closeDrawer() {
      this.drawerVisible = false;
      this.projectDetail = null;
      this.currentProjectId = null;
    },

    // 切换页码
    async changePage(page) {
      this.queryParams.page = page;
      console.log('this.queryParams', this.queryParams);
      await this.fetchProjectList();
    },

    // 切换每页数量
    async changePageSize(pageSize) {
      this.queryParams.pageSize = pageSize;
      this.queryParams.page = 1; // 重置为第一页
      await this.fetchProjectList();
    },

    // 按项目名称搜索
    async searchByName(project_name) {
      this.queryParams.project_name = project_name;
      this.queryParams.page = 1; // 重置为第一页
      await this.fetchProjectList();
    },

    // 按项目编码搜索
    async searchByCode(project_code) {
      this.queryParams.project_code = project_code;
      this.queryParams.page = 1; // 重置为第一页
      await this.fetchProjectList();
    },

    // 按状态筛选
    async filterByStatus(status) {
      this.queryParams.status = status !== '' ? status : null;
      this.queryParams.page = 1; // 重置为第一页
      await this.fetchProjectList();
    },

    // 刷新列表
    async refreshList() {
      await this.fetchProjectList();
    }
  }
});