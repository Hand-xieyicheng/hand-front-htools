import request from '@/utils/request';
import { useHandAuthStoreNew } from '@/stores/handLoginNew';
import handRequest from '@/utils/requestHand';
/**
 * 返回消息管理服务
 */
const responseMessageService = {
    /**
     * 获取返回消息列表
     * @param {Object} params - 查询参数
     * @returns {Promise} - 返回Promise对象
     */
    queryCommonLansResponseData(queryParams, env) {
        // 获取env的数据
        const handAuthNewStore = useHandAuthStoreNew();
        const envData = handAuthNewStore.getEnvItemById(env);
        return handRequest({
            url: '/hpfm/v1/response-messages',
            method: 'GET',
            config: {
                envData,
            },
            params: {
                ...queryParams,
                page: queryParams.page || 0,
                size: queryParams.size || 100,
            },
        });
    },

    /**
     * 获取返回消息详情
     * @param {number} id - 返回消息ID
     * @returns {Promise} - 返回Promise对象
     */
    getMessageDetail(id) {
        return request({
            url: `/api/response-message/detail/${id}`,
            method: 'get'
        });
    },

    /**
     * 添加新返回消息
     * @param {Object} data - 返回消息数据
     * @returns {Promise} - 返回Promise对象
     */
    addNewMessage(data, env) {
        // 获取env的数据
        const handAuthNewStore = useHandAuthStoreNew();
        const envData = handAuthNewStore.getEnvItemById(env);
        return handRequest({
            url: '/hpfm/v1/response-messages',
            method: 'POST',
            config: {
                envData,
            },
            data,
        });
    },

    /**
     * 更新返回消息
     * @param {number} id - 返回消息ID
     * @param {Object} data - 返回消息数据
     * @returns {Promise} - 返回Promise对象
     */
    updateExistingMessage(id, data) {
        return request({
            url: `/api/response-message/update/${id}`,
            method: 'put',
            data
        });
    },

    /**
     * 删除返回消息
     * @param {number} id - 返回消息ID
     * @returns {Promise} - 返回Promise对象
     */
    deleteExistingMessage(selectedMessage, env) {
        // 获取env的数据
        const handAuthNewStore = useHandAuthStoreNew();
        const envData = handAuthNewStore.getEnvItemById(env);
        return handRequest({
            url: '/hpfm/v1/response-messages',
            method: 'DELETE',
            config: {
                envData,
            },
            data: {
                ...selectedMessage
            },
        });
    },

    /**
     * 批量删除返回消息
     * @param {Array} ids - 返回消息ID数组
     * @returns {Promise} - 返回Promise对象
     */
    batchDeleteMessage(ids) {
        return request({
            url: '/api/response-message/batch-delete',
            method: 'delete',
            data: { ids }
        });
    }
};

export default responseMessageService;