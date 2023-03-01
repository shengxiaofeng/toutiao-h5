import request from '@/utils/request'

// 登录接口
export const login = ({ mobile, code }) => {
  return request.post('/v1_0/authorizations', {
    mobile,
    code
  })
}
// export const login = data => {
//   return request.post('/v1_0/authorizations', data)
// }
