import axios from 'axios'

const baseURL = 'http://toutiao.itheima.net'
const request = axios.create({
  baseURL: baseURL
})

export default request
