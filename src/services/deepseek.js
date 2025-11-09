import axios from 'axios';

// 查询余额
const API_KEY = "sk-1a1016f437c34fd59abd724cd28b9fda";
export function getBalance(params) {
    return axios({
        url: 'https://api.deepseek.com/user/balance',
        method: 'get',
        params,
        headers: {
            Authorization: `Bearer ${API_KEY}`,
        }
    })
}
