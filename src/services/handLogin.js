import handRequest from '@/utils/requestHand';


export const getSelfData = (data) => {
  return handRequest({
    url: '/iam/hzero/v1/users/self',
    method: 'get',
  });
}

// 获取多语言common字段
export const getCommonLansData = (params, envData) => {
  return handRequest({
    url: '/hpfm/v1/prompts/page-list',
    method: 'get',
    config: {
      envData,
    },
    params: {
      page: 0,
      promptKey: 'hfat.common',
      size: 100,
      tenantId: 0,
      ...params
    },
  });
}
