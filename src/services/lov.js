import handRequest from '@/utils/requestHand';
// 获取值集头信息
export function getLovHeader(keyword, envData) {
    return handRequest({
        url: '/hpfm/v1/lov-headers',
        method: 'get',
        config: {
            envData: envData ?? undefined,
        },
        params: {
            keyword,
            page: 0,
            size: 20,
        },
    });
}

// 获取值集详细信息
export function getLovDetail(lovHeaderId, envData) {
    return handRequest({
        url: `/hpfm/v1/lov-headers/${lovHeaderId}?lovId=${lovHeaderId}`,
        method: 'get',
        config: {
            envData: envData ?? undefined,
        },
    });
}

// 获取值集行信息
export function getLovRows(lovHeaderId, envData) {
    return handRequest({
        url: `/hpfm/v1/lov-headers/${lovHeaderId}/values`,
        method: 'get',
        config: {
            envData: envData ?? undefined,
        },
        params: {
            lovHeaderId,
            page: 0,
            size: 100,
        },
    });
}

// 获取行数据的多语言列表数据
export function getLovRowsLanguages(_token, envData) {
    return handRequest({
        url: `/hpfm/v1/multi-language`,
        method: 'get',
        config: {
            envData: envData ?? undefined,
        },
        params: {
            _token: _token,
            fieldName: 'meaning',
        },
    });
}

// 新建值集头
export function setLovHeader(data, envData) {
    return handRequest({
        url: `/hpfm/v1/lov-headers`,
        method: 'post',
        config: {
            envData: envData ?? undefined,
        },
        data: {
            "tenantId": 0,
            "lovName": "ddd",
            "lovTypeCode": "IDP",
            "_tls": {
                "lovName": {
                    "zh_CN": "ddd",
                    "en_US": "aaa",
                    "ja_JP": "ccc",
                    "cht_CN": "vvv",
                    "zh_TW": "bbb"
                },
                "description": {}
            },
            "publicFlag": 1,
            "_status": "create",
            "enabledFlag": 1,
            "mustPageFlag": 1,
            ...data
        }
    });
}

// 新建值集行
export function setLovLine(data, envData) {
    return handRequest({
        url: `/hpfm/v1/lov-values`,
        method: 'post',
        config: {
            envData: envData ?? undefined,
        },
        data: {
            // "value": "1",
            // "meaning": "成功",
            // "orderSeq": 10,
            // "enabledFlag": 1,
            // "lovId": 5841,
            // "lovCode": "HFCM.ANALYSIS_RESULT_MSG_STATUS",
            // "tenantId": 0,
            ...data
        }
    });
}
