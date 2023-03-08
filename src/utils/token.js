// 封装3个方法，专门操作token

const key = 'toutiao'

// 设置
export const setToken = (token) => {
  localStorage.setItem(key, token)
}
// 获取 ,写了大括号要写return
// export const getToken = () => {
//   localStorage.getItem(key)
// }
export const getToken = () => localStorage.getItem(key)

// 移除
export const removeToken = () => {
  localStorage.removeItem(key)
}
