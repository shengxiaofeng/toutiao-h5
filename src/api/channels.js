import request from '@/utils/request'

export const getAllChannels = () => {
  return request.get('/v1_0/channels')
}
