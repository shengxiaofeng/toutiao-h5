import request from '@/utils/request'

// 获取所有频道
export const getAllChannels = () => {
  return request.get('/v1_0/channels')
}

// 获取用户频道
export const getUserChannerls = () => {
  return request.get('/v1_0/user/channels')
}

// 更新覆盖频道
export const updateChannels = ({ channels }) => {
  return request.put('/v1_0/user/channels', { channels }
  )
}
// 下面这种写法错误,data请求直接写大括号里面的
// export const updateChannels = ({ channels }) => {
//   return request.put('/v1_0/user/channels', {
//     data:{
//       channels
//     }
//   })
// }

// 删除指定的频道
export const removeTheChannel = ({ channelId }) => {
  return request.delete(`/v1_0/user/channels/${channelId}`)
}
