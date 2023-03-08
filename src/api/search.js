import request from '@/utils/request'

// 搜索建议
export const getSuggestion = ({ kw }) => {
  return request.get('/v1_0/suggestion', {
    params: {
      q: kw
    }
  })
}
// 获取搜索结果
export const getSearch = ({ page = 1, per_page = 10, q }) => {
  return request.get('/v1_0/search', {
    params: {
      page,
      per_page,
      q
    }
  })
}
