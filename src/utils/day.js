import dayjs from 'dayjs'
import 'dayjs/locale/zh' // 导入本地化语言
import relativeTime from 'dayjs/plugin/relativeTime'// 到指定时间需要的插件
// import Vue from 'vue'
export const timeAgo = (targetTime) => {
  dayjs.extend(relativeTime)
  dayjs.locale('zh')
  const a = dayjs()
  const b = dayjs(targetTime)
  return a.to(b)// 返回多久之前。。。
}
// 全局使用，可放在main中
// Vue.prototype.$formatDate = (dateObj) => {
//   return dayjs(dateObj).format('YYYY-MM-DD')
// }
export const formatDate = (dateObj) => {
  return dayjs(dateObj).format('YYYY-MM-DD')
}
