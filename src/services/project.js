import request from '@/utils/request';

/**
 * 获取项目列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码，默认1
 * @param {number} params.pageSize - 每页数量，默认10
 * @param {string} params.project_name - 项目名称（可选）
 * @param {string} params.project_code - 项目编码（可选）
 * @param {number} params.status - 项目状态（可选，1=启用，0=禁用）
 * @param {number} params.user_id - 用户ID
 * @returns {Promise} - 返回Promise对象
 */
export async function getProjectList(params = {}) {
  return request({
    url: '/project/getProjectList',
    method: 'get',
    params: {
      page: params.page || 1,
      pageSize: params.pageSize || 10,
      project_name: params.project_name || '',
      project_code: params.project_code || '',
      status: params.status,
      user_id: params.user_id
    }
  });
}

/**
 * 获取单个项目详情
 * @param {number} id - 项目ID
 * @returns {Promise} - 返回Promise对象
 */
export async function getProject(id) {
  return request({
    url: `/project/getProject/${id}`,
    method: 'get'
  });
}

/**
 * 添加项目
 * @param {Object} data - 项目数据
 * @param {string} data.project_name - 项目名称
 * @param {string} data.project_code - 项目编码
 * @param {number} data.sort - 排序权重
 * @param {string} data.remark - 备注
 * @returns {Promise} - 返回Promise对象
 */
export async function addProject(data) {
  return request({
    url: '/project/addProject',
    method: 'post',
    data
  });
}

/**
 * 更新项目
 * @param {number} id - 项目ID
 * @param {Object} data - 更新的项目数据
 * @returns {Promise} - 返回Promise对象
 */
export async function updateProject(id, data) {
  return request({
    url: `/project/updateProject/${id}`,
    method: 'put',
    data
  });
}

/**
 * 删除项目
 * @param {number} id - 项目ID
 * @returns {Promise} - 返回Promise对象
 */
export async function deleteProject(id) {
  return request({
    url: `/project/deleteProject/${id}`,
    method: 'delete'
  });
}