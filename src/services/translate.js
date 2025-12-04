import request from '@/utils/request';

/**
 * 获取翻译结果
 * @param {Object} data - 翻译数据
 * @param {string} data.q - 待翻译文本
 * @param {string} data.from - 源语言
 * @param {string} data.to - 目标语言
 * @returns {Promise} - 返回Promise对象
 */
export async function getTranslate(data) {
    return request({
        url: '/baidu/baiduTextApi',
        method: 'get',
        params: data
    });
}