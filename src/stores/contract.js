import { defineStore } from 'pinia';
import { getContractList, getContract, addContract, updateContract, deleteContract } from '../services/contract';

export const useContractStore = defineStore('contract', {
  persist: true,
  state: () => ({
    // 关联人列表数据
    contractList: [],
    // 单个关联人详情
    contractDetail: null,
    // 查询参数
    queryParams: {
      keyword: '',
      relation: '',
      page: 1,
      pageSize: 10
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
    // 当前编辑的关联人ID
    currentContractId: null
  }),

  getters: {
    // 获取当前页的关联人列表
    currentPageContracts: (state) => {
      return state.contractList;
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
        keyword: '',
        relation: '',
        page: 1,
        pageSize: 10
      };
    },

    // 获取关联人列表
    async fetchContractList() {
      this.loading = true;
      console.log('this.queryParams', this.queryParams);
      try {
        const response = await getContractList(this.queryParams);
        if (response.data) {
          this.contractList = response.data.list || [];
          this.pagination = {
            total: response.data.total || 0,
            page: response.data.page || 1,
            pageSize: response.data.pageSize || 10,
            totalPages: response.data.totalPages || 0
          };
        }
        return response;
      } catch (error) {
        console.error('获取关联人列表失败:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 获取关联人详情
    async fetchContractDetail(id) {
      try {
        const response = await getContract(id);
        if (response.data) {
          this.contractDetail = response.data;
        }
        return response;
      } catch (error) {
        console.error('获取关联人详情失败:', error);
        throw error;
      }
    },

    // 添加关联人
    async addNewContract(data) {
      try {
        const response = await addContract(data);
        // 添加成功后刷新列表
        await this.fetchContractList();
        return response;
      } catch (error) {
        console.error('添加关联人失败:', error);
        throw error;
      }
    },

    // 更新关联人
    async updateExistingContract(id, data) {
      try {
        const response = await updateContract(id, data);
        // 更新成功后刷新列表
        await this.fetchContractList();
        return response;
      } catch (error) {
        console.error('更新关联人失败:', error);
        throw error;
      }
    },

    // 删除关联人
    async deleteExistingContract(id) {
      try {
        const response = await deleteContract(id);
        // 删除成功后刷新列表
        await this.fetchContractList();
        return response;
      } catch (error) {
        console.error('删除关联人失败:', error);
        throw error;
      }
    },

    // 打开添加抽屉
    openAddDrawer() {
      this.currentAction = 'add';
      this.contractDetail = null;
      this.drawerVisible = true;
    },

    // 打开编辑抽屉
    async openEditDrawer(id) {
      this.currentAction = 'edit';
      this.currentContractId = id;
      try {
        await this.fetchContractDetail(id);
        this.drawerVisible = true;
      } catch (error) {
        console.error('打开编辑抽屉失败:', error);
      }
    },

    // 关闭抽屉
    closeDrawer() {
      this.drawerVisible = false;
      this.contractDetail = null;
      this.currentContractId = null;
    },

    // 切换页码
    async changePage(page) {
      this.queryParams.page = page;
      console.log('this.queryParams', this.queryParams);
      await this.fetchContractList();
    },

    // 切换每页数量
    async changePageSize(pageSize) {
      this.queryParams.pageSize = pageSize;
      this.queryParams.page = 1; // 重置为第一页
      await this.fetchContractList();
    },

    // 搜索关联人
    async searchContracts(keyword) {
      this.queryParams.keyword = keyword;
      this.queryParams.page = 1; // 重置为第一页
      await this.fetchContractList();
    },

    // 按关系筛选
    async filterByRelation(relation) {
      this.queryParams.relation = relation;
      this.queryParams.page = 1; // 重置为第一页
      await this.fetchContractList();
    }
  }
});