import request from '@/utils/request'

// 获取所有文章
export const getAllArticles = ({ channel_id, timestamp }) => {
  return request.get('/v1_0/articles', {
    params: {
      channel_id,
      timestamp
    }
  }
  )
}

// 获取文章详情
export const getArticleInfo = ({ article_id }) => {
  return request.get(`/v1_0/articles/${article_id}`)
}

// 对文章点赞
export const articleLove = ({ art_id }) => {
  return request.post('/v1_0/article/likings', {
    target: art_id
  })
}

// 取消对文章点赞
export const deleteArticleLove = ({ art_id }) => {
  return request.delete(`/v1_0/article/likings/${art_id}`)
}
// 对文章收藏
export const artCollection = ({ art_id }) => {
  return request.post('/v1_0/article/collections', { target: art_id })
}
// 取消对文章收藏
export const deleteArtCollection = ({ art_id }) => {
  return request.delete(`/v1_0/article/collections/${art_id}`)
}
