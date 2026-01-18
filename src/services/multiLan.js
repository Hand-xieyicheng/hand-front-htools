import request from '@/utils/request';
import handRequest from '@/utils/requestHand';

// 获取字段id
export function getFiledIdByAi(data) {
  return request({
    url: '/multiLanAi/getFiledIdByAi',
    method: 'post',
    data,
  });
}

// 获取字段id及其翻译
export function getFiledIdAndTranslateByAi(data) {
  return request({
    url: '/multiLanAi/getFiledIdAndTranslateByAi',
    method: 'post',
    data,
  });
}

// 获取翻译
export function getTranslateByAi(data) {
  return request({
    url: '/multiLanAi/getTranslateByAi',
    method: 'post',
    data,
  });
}

// 获取历史记录列表
export function getHistoryList(data) {
  return request({
    url: '/multiLanHistory/getHistoryList',
    method: 'get',
    params: data,
  });
}

// 保存历史记录
export function saveHistory(data) {
  return request({
    url: '/multiLanHistory/addHistory',
    method: 'post',
    data,
  });
}
// 删除历史记录
export function deleteHistoryData(id) {
  return request({
    url: '/multiLanHistory/deleteHistory/' + id,
    method: 'delete',
  });
}

// 新增数据
export function addCommonLansData(data, envData) {
  return handRequest({
    url: '/hpfm/v1/prompts/insert',
    method: 'post',
    config: {
      envData,
    },
    data,
  });
}
// 更新数据
export function updateCommonLansData(data, envData) {
  return handRequest({
    url: '/hpfm/v1/prompts/update',
    method: 'PUT',
    config: {
      envData,
    },
    data,
  });
}

// 新增返回消息
export function addCommonLansResponseData(data, envData) {
  return handRequest({
    url: '/hpfm/v1/response-messages',
    method: 'POST',
    config: {
      envData,
    },
    data,
  });
}
// 编辑返回消息
export function updateCommonLansResponseData(data, envData) {
  return handRequest({
    url: '/hpfm/v1/response-messages',
    method: 'PUT',
    config: {
      envData,
    },
    data,
  });
}
// 删除返回消息
export function deleteCommonLansResponseData(data, envData) {
  return handRequest({
    url: '/hpfm/v1/response-messages',
    method: 'DELETE',
    config: {
      envData,
    },
    data,
  });
}
