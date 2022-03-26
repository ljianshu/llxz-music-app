import { createRouter, createWebHashHistory } from 'vue-router'
const Recommend = () => import('@/views/recommend'/* webpackChunkName: "recommend" */)
const Singer = () => import('@/views/singer'/* webpackChunkName: "singer" */)
const SingerDetail = () => import('@/views/singer-detail'/* webpackChunkName: "SingerDetail" */)
const Search = () => import('@/views/search'/* webpackChunkName: "search" */)
const TopList = () => import('@/views/top-list'/* webpackChunkName: "top-list" */)
const TopDetail = () => import('@/views/top-detail'/* webpackChunkName: "top-detail" */)

const routes = [
  {
    path: '/',
    redirect: '/recommend'
  },
  {
    path: '/recommend',
    name: Recommend,
    component: Recommend
  },
  {
    path: '/singer',
    name: Singer,
    component: Singer,
    children: [
      {
        path: ':id',
        name: SingerDetail,
        component: SingerDetail
      }
    ]
  },
  {
    path: '/search',
    name: Search,
    component: Search
  },
  {
    path: '/top-list',
    name: TopList,
    component: TopList,
    children: [
      {
        path: ':id',
        name: TopDetail,
        component: TopDetail
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
