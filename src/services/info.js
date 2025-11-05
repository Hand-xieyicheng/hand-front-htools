import request from '@/utils/request';

// 注册
export function getUserInfo(data) {
  return request({
    url: '/login/api/get-user-info',
    method: 'get',
    params: data,   
  });
}
