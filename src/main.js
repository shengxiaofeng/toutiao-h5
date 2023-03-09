import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vant, { Lazyload } from 'vant'
import directiveObj from './utils/directive'

import 'vant/lib/index.css'
// 引入全部样式,不能再加单独的样式了，样式会冲突
import 'vant/lib/index.less'

import 'amfe-flexible'

// import './utils/day'

Vue.use(Vant)

Vue.use(Lazyload)

Vue.config.productionTip = false

// 执行目标对象里的install方法，并传入Vue类
Vue.use(directiveObj)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
