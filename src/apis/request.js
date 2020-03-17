import Axios from 'axios'
import {Message} from 'element-ui'
import router from '@/router'

let req = Axios.create({
    timeout: 15000,
})

const errorHandle = (response) => {
    if (response.status === 401) {
        localStorage.setItem("accessToken","");
        router.push("/login")
    }
    if (response.status === 404) {
        router.push('/404')
    }
}

req.interceptors.response.use(response => {
    return response.data
}, error => {
    const {response} = error
    if (response) {
        errorHandle(response)
        return Promise.reject(response)
    } else {
        // 处理断网
        if (!window.navigator.onLine) {
            alert("断网了")
        } else {
            Message({
                message: error,
                type: 'error'
            })
        }
    }
    return Promise.reject(error)
})

req.interceptors.request.use(config => {
    config.headers.common = {
        "accessToken": localStorage.getItem("accessToken")
    }
    return config;
}, err => {
    Message.error('请求超时');
    return Promise.resolve(err);
});

export default req
