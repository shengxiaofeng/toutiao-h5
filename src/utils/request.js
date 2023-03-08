import router from '@/router'
import axios from 'axios'
import { Toast } from 'vant'
import { getToken, removeToken } from './token'

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
    router.replace('/login')
  }
  return Promise.reject(error)
})

export default request
