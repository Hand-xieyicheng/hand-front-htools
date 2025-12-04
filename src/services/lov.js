import handRequest from '@/utils/requestHand';
// 获取值集头信息
export function getLovHeader(keyword) {
    return handRequest({
        url: '/hpfm/v1/lov-headers',
        method: 'get',
        params: {
            keyword,
            page: 0,
            size: 20,
        },
    });
}

// 获取值集详细信息
export function getLovDetail(lovHeaderId) {
    return handRequest({
        url: `/hpfm/v1/lov-headers/${lovHeaderId}?lovId=${lovHeaderId}`,
        method: 'get',
    });
}

// 获取值集行信息
export function getLovRows(lovHeaderId) {
    return handRequest({
        url: `/hpfm/v1/lov-headers/${lovHeaderId}/values`,
        method: 'get',
        params: {
            lovHeaderId,
            page: 0,
            size: 100,
        },
    });
}

// 获取行数据的多语言列表数据
export function getLovRowsLanguages(_token) {
    return handRequest({
        url: `/hpfm/v1/multi-language`,
        method: 'get',
        params: {
            _token: _token,
            fieldName: 'meaning',
        },
    });
}