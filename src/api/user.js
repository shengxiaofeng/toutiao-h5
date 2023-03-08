import request from '@/utils/request'

// 登录
export const login = ({ mobile, code }) => {
  return request.post('/v1_0/authorizations', {
    mobile,
    code
  })
}
// export const login = data => {
//   return request.post('/v1_0/authorizations', data)
// }

// 关注用户
export const userFollow = ({ aut_id }) => {
  return request.post('/v1_0/user/followings', { target: aut_id })
}

// 取消关注用户
export const deleteUserFollow = ({ aut_id }) => {
  return request.delete(`/v1_0/user/followings/${aut_id}`)
}
// 获取用户个人资料(编辑页面使用)
export const getUserProfile = () => {
  return request.get('/v1_0/user/profile')
}
// 获取用户自己的信息
export const getUser = () => {
  return request.get('/v1_0/user')
}
// 编辑用户照片
export const editUserPhoto = (fd) => {
  return request.patch('/v1_0/user/photo', fd)
}
// 编辑用户资料
export const editUserPro = data => {
  return request.patch('/v1_0/user/profile', data)
}
