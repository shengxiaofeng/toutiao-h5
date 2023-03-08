// import router from '@/router'
import axios from 'axios'
import { Toast } from 'vant'
import { getToken, removeToken, setToken } from './token'
import { getNewToken } from '@/api/user'

const baseURL = 'http://toutiao.itheima.net'
const request = axios.create({
  baseURL: baseURL
})

// 请求拦截器 https://github.com/axios/axios#interceptors
request.interceptors.request.use(function (config) {
  // 如果用户已登录，统一给接口设置 token 信息
  if (getToken()?.length > 0 && config.headers.Authorization === undefined) {
    config.headers.Authorization = `Bearer ${getToken()}`
  }
  console.log(config)
  // 处理完之后一定要把 config 返回，否则请求就会停在这里 config:本次请求配置对象
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

// 响应拦截器
request.interceptors.response.use(function (response) {
  return response
}, async function (error) {
  // 超过2XX的状态码都会进入这里
  console.dir(error)// 错误对象
  if (error.response.status === 401) {
    Toast('身份已过期')
    removeToken()// 先清除token，才能让路由守卫判断失效，放行去登录页
    // router.replace('/login')//第一种方法强制跳转登录页面，用户有感知，体验不好
    // 第二种，用refresh_token换回新的token用户可继续使用，js代码实现，用户无感知
    const res = await getNewToken()
    // 1.新拿回来的 token,需要更新到本地、
    setToken(res.data.data.token)
    // 更新新的token在请求头里
    error.config.headers.Authorization = `Bearer ${res.data.data.token}`
    // 2.未完成的这次请求，再次发起
    // error.config就是上一次请求的配置对象
    return request(error.config)
  }
  return Promise.reject(error)
})

export default request
