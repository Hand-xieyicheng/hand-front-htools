import request from '@/utils/request';

/**
 * 环境信息相关API服务
 */
const envService = {
  /**
   * 获取环境信息列表
   * @param {Object} params - 查询参数
   * @returns {Promise} 请求结果
   */
  getEnvList: (params) => {
    return request({ 
      url: '/env/list', 
      method: 'GET', 
      params 
    });
  },

  /**
   * 获取环境信息详情
   * @param {Number} id - 环境ID
   * @returns {Promise} 请求结果
   */
  getEnvDetail: (id) => {
    return request({ 
      url: `/env/detail/${id}`, 
      method: 'GET' 
    });
  },

  /**
   * 添加环境信息
   * @param {Object} data - 环境信息数据
   * @returns {Promise} 请求结果
   */
  addEnv: (data) => {
    return request({ 
      url: '/env/add', 
      method: 'POST', 
      data 
    });
  },

  /**
   * 更新环境信息
   * @param {Number} id - 环境ID
   * @param {Object} data - 环境信息数据
   * @returns {Promise} 请求结果
   */
  updateEnv: (id, data) => {
    return request({ 
      url: `/env/update/${id}`, 
      method: 'PUT', 
      data 
    });
  },

  /**
   * 删除环境信息
   * @param {Number} id - 环境ID
   * @returns {Promise} 请求结果
   */
  deleteEnv: (id) => {
    return request({ 
      url: `/env/delete/${id}`, 
      method: 'DELETE' 
    });
  }
};

export default envService;