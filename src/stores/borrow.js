import { defineStore } from 'pinia';
import { getBorrowList, getBorrowDetail, addBorrow, updateBorrow, deleteBorrow, updateRepayment, getRepaymentReminders } from '../services/borrow';

export const useBorrowStore = defineStore('borrow', {
  persist: true,
  state: () => ({
    // 借款列表数据
    borrowList: [],
    // 单个借款详情
    borrowDetail: null,
    // 查询参数
    queryParams: {
      keyword: '',
      status: '',
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
    // 当前编辑的借款ID
    currentBorrowId: null,
    // 还款提醒列表
    reminders: []
  }),

  getters: {
    // 获取当前页的借款列表
    currentPageBorrows: (state) => {
      return state.borrowList;
    },
    // 获取查询条件
    getQueryParams: (state) => {
      return state.queryParams;
    },
    // 获取待还款数量
    pendingRepaymentCount: (state) => {
      return state.reminders.length;
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
        status: '',
        page: 1,
        pageSize: 10
      };
    },

    // 获取借款列表
    async fetchBorrowList() {
      this.loading = true;
      console.log('this.queryParams', this.queryParams);
      try {
        const response = await getBorrowList(this.queryParams);
        if (response.data) {
          this.borrowList = response.data.list || [];
          this.pagination = {
            total: response.data.total || 0,
            page: response.data.page || 1,
            pageSize: response.data.pageSize || 10,
            totalPages: Math.ceil((response.data.total || 0) / (response.data.pageSize || 10))
          };
        }
        return response;
      } catch (error) {
        console.error('获取借款列表失败:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 获取借款详情
    async fetchBorrowDetail(id) {
      try {
        const response = await getBorrowDetail(id);
        if (response.data) {
          this.borrowDetail = response.data;
        }
        return response;
      } catch (error) {
        console.error('获取借款详情失败:', error);
        throw error;
      }
    },

    // 添加借款
    async addNewBorrow(data) {
      try {
        const response = await addBorrow(data);
        // 添加成功后刷新列表
        await this.fetchBorrowList();
        return response;
      } catch (error) {
        console.error('添加借款失败:', error);
        throw error;
      }
    },

    // 更新借款信息
    async updateExistingBorrow(id, data) {
      try {
        const response = await updateBorrow(id, data);
        // 更新成功后刷新列表
        await this.fetchBorrowList();
        return response;
      } catch (error) {
        console.error('更新借款信息失败:', error);
        throw error;
      }
    },

    // 删除借款
    async deleteExistingBorrow(id) {
      try {
        const response = await deleteBorrow(id);
        // 删除成功后刷新列表
        await this.fetchBorrowList();
        return response;
      } catch (error) {
        console.error('删除借款失败:', error);
        throw error;
      }
    },

    // 更新还款状态
    async updateRepaymentStatus(id, data) {
      try {
        const response = await updateRepayment(id, data);
        // 更新成功后刷新当前借款详情
        if (this.currentBorrowId) {
          await this.fetchBorrowDetail(this.currentBorrowId);
        }
        // 同时刷新列表
        await this.fetchBorrowList();
        // 刷新提醒
        await this.fetchReminders();
        return response;
      } catch (error) {
        console.error('更新还款状态失败:', error);
        throw error;
      }
    },

    // 获取待还款提醒
    async fetchReminders() {
      try {
        const response = await getRepaymentReminders();
        if (response.data) {
          this.reminders = response.data || [];
        }
        return response;
      } catch (error) {
        console.error('获取待还款提醒失败:', error);
        throw error;
      }
    },

    // 打开添加抽屉
    openAddDrawer() {
      this.currentAction = 'add';
      this.borrowDetail = null;
      this.drawerVisible = true;
    },

    // 打开编辑抽屉
    async openEditDrawer(id) {
      this.currentAction = 'edit';
      this.currentBorrowId = id;
      try {
        await this.fetchBorrowDetail(id);
        this.drawerVisible = true;
      } catch (error) {
        console.error('打开编辑抽屉失败:', error);
      }
    },

    // 关闭抽屉
    closeDrawer() {
      this.drawerVisible = false;
      this.borrowDetail = null;
      this.currentBorrowId = null;
    },

    // 切换页码
    async changePage(page) {
      this.queryParams.page = page;
      console.log('this.queryParams', this.queryParams);
      await this.fetchBorrowList();
    },

    // 切换每页数量
    async changePageSize(pageSize) {
      this.queryParams.pageSize = pageSize;
      this.queryParams.page = 1; // 重置为第一页
      await this.fetchBorrowList();
    },

    // 搜索借款
    async searchBorrows(keyword) {
      this.queryParams.keyword = keyword;
      this.queryParams.page = 1; // 重置为第一页
      await this.fetchBorrowList();
    },

    // 按状态筛选
    async filterByStatus(status) {
      this.queryParams.status = status;
      this.queryParams.page = 1; // 重置为第一页
      await this.fetchBorrowList();
    },

    // 刷新数据
    async refreshData() {
      await this.fetchBorrowList();
      await this.fetchReminders();
    }
  }
});