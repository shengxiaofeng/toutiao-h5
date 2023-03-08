import Vue from 'vue'
import VueRouter from 'vue-router'

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

export default router
