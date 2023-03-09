// 对Vue的全局指令，进行封装 封装中间件函数插件,自动聚焦 v-fofo
const directiveObj = {
  install (Vue) {
    Vue.directive('fofo', {
      inserted (el) {
        // 指令所在van-search组件
        // 组件根标签是div，input在内部
        // 以上都是原生标签对象，原生对象要想拿到，要用querySelector
        // el是这个指令所在的标签
        // 搜索页面 el是div
        // 文章评论el是textarea
        // 以后el 还可能是input
        // 知识点：原生DOM.nodeName拿到标签名字（注意：大写的字符串）
        if (el.nodeName === 'TEXTAREA' || el.nodeName === 'INPUT') {
          el.focus()
        } else {
          const theInput = el.querySelector('input')
          const theTextArea = el.querySelector('textarea')
          if (theInput) theInput.focus()
          if (theTextArea) theTextArea.focus()
        }
      }
    })
  }
}
export default directiveObj
