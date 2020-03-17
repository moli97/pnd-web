import request from './request'

/**
 * 登录，退出
 */
export const login = (data) => {
    return request({
        url: `/v1/login`,
        method: 'post',
        data: data,
        transformRequest: [function (data) {
            let ret = '';
            for (let it in data) {
                ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&';
            }
            return ret;
        }],
    })
}

export const logout = (data) => {
    return request({
        url: `/v1/logout`,
        method: 'post',
        data: data,
        transformRequest: [function (data) {
            let ret = '';
            for (let it in data) {
                ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&';
            }
            return ret;
        }],
    })
}
