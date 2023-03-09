import Vue from 'vue'
import VueRouter from 'vue-router'
import { getToken } from '@/utils/token'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login/')
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/Search/')
  },
  {
    path: '/searchResult/:kw',
    name: 'searchResult',
    component: () => import('@/views/Search/SearchResult')
  },
  {
    path: '/articleInfo',
    name: 'articleInfo',
    component: () => import('@/views/ArticleInfo')
  },
  {
    path: '/userPro',
    name: 'userPro',
    component: () => import('@/views/EditUserPro/')
  },
  {
    path: '/',
    redirect: '/home', // 这里默认打开首页（layout下面的home)
    component: () => import('@/views/Layout'),
    children: [
      {
        path: 'home',
        name: 'home',
        component: () => import('@/views/Home/')
      },
      {
        path: 'my',
        name: 'my',
        component: () => import('@/views/My/')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 全局前置守卫,路由在真正跳转之前执行此函数
router.beforeEach((to, from, next) => {
  // 如果已经登录了，不要切换到登录页面,?的作用，本地没有值就显示空
  if (getToken()?.length > 0 && to.path === '/login') {
    next('/home')// 留在原地/什么都不写
  } else {
    next()// 其他情况放行
  }
})
export default router
