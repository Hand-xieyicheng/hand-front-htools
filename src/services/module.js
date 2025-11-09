import request from '@/utils/request';

/**
 * 获取模块列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码，默认1
 * @param {number} params.pageSize - 每页数量，默认10
 * @param {string} params.module_name - 模块名称（可选）
 * @param {string} params.module_code - 模块编码（可选）
 * @param {number} params.status - 模块状态（可选，1=启用，0=禁用）
 * @param {number} params.project_id - 项目ID
 * @param {number} params.user_id - 用户ID
 * @returns {Promise} - 返回Promise对象
 */
export async function getModuleList(params = {}) {
  return request({
    url: '/module/getModuleList',
    method: 'get',
    params: {
      page: params.page || 1,
      pageSize: params.pageSize || 10,
      module_name: params.module_name || '',
      module_code: params.module_code || '',
      status: params.status,
      project_id: params.project_id,
      user_id: params.user_id
    }
  });
}

/**
 * 获取单个模块详情
 * @param {number} id - 模块ID
 * @returns {Promise} - 返回Promise对象
 */
export async function getModule(id) {
  return request({
    url: `/module/getModule/${id}`,
    method: 'get'
  });
}

/**
 * 添加模块
 * @param {Object} data - 模块数据
 * @param {string} data.module_name - 模块名称
 * @param {string} data.module_code - 模块编码
 * @param {number} data.project_id - 项目ID
 * @param {number} data.sort - 排序权重
 * @param {string} data.remark - 备注
 * @returns {Promise} - 返回Promise对象
 */
export async function addModule(data) {
  return request({
    url: '/module/addModule',
    method: 'post',
    data
  });
}

/**
 * 更新模块
 * @param {number} id - 模块ID
 * @param {Object} data - 更新的模块数据
 * @returns {Promise} - 返回Promise对象
 */
export async function updateModule(id, data) {
  return request({
    url: `/module/updateModule/${id}`,
    method: 'put',
    data
  });
}

/**
 * 删除模块
 * @param {number} id - 模块ID
 * @returns {Promise} - 返回Promise对象
 */
export async function deleteModule(id) {
  return request({
    url: `/module/deleteModule/${id}`,
    method: 'delete'
  });
}