import request from '@/utils/request';

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