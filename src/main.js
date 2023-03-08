import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vant from 'vant'
import 'vant/lib/index.css'
// 引入全部样式,不能再加单独的样式了，样式会冲突
import 'vant/lib/index.less'

import 'amfe-flexible'

// import './utils/day'

Vue.use(Vant)

Vue.config.productionTip = false

// 封装中间件函数插件
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
// 执行目标对象里的install方法，并传入Vue类
Vue.use(directiveObj)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
