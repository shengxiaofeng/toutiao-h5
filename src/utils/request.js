// import router from '@/router'
import axios from 'axios'
// import { Toast } from 'vant'//封装了不能直接引入vant里面的了
import Toast from '@/ui/toast'
// import { getToken, removeToken, setToken } from './token'
import { getToken, removeToken } from './token'
// import { getNewToken } from '@/api/user'

import router from '@/router'

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
    router.replace(`/login?path=${router.currentRoute.fullPath}`)// 第一种方法强制跳转登录页面，用户有感知，体验不好
  }
  // 第二种，用refresh_token换回新的token用户可继续使用，js代码实现，用户无感知
  // const res = await getNewToken()
  // // 1.新拿回来的 token,需要更新到本地、
  // setToken(res.data.data.token)
  // // 更新新的token在请求头里
  // error.config.headers.Authorization = `Bearer ${res.data.data.token}`
  // 2.未完成的这次请求，再次发起
  // error.config就是上一次请求的配置对象
  //   return request(error.config)
  // } else if (error.response.status === 500 && error.config.url === '/v1_0/authorizations' && error.config.method === 'put') {
  //   // 刷新的refresh_token也过期了
  //   removeToken()
  //   localStorage.clear()// 清除localStorage所有值
  //   router.push({ path: `/login?path=${router.currentRoute.fullPath}` })
  // }
  return Promise.reject(error)
})

export default request
