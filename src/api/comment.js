import request from '@/utils/request'

// 获取评论
export const getCommentList = ({ type, source, offset, limit }) => {
  return request.get('/v1_0/comments', {
    params: {
      // axios只针对params参数，如果发现键值对，值为null，会忽略此参数名和值不携带在url?后面
      type, // 什么时候需要外面传，此值会变化
      source,
      offset,
      limit
    }
  })
}
// 对评论点赞
export const commentLike = ({ commentId }) => {
  return request.post('/v1_0/comment/likings', { target: commentId })
}
