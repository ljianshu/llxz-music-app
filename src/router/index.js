import { createRouter, createWebHashHistory } from 'vue-router'
const Recommend = () => import('@/views/recommend'/* webpackChunkName: "recommend" */)
const Singer = () => import('@/views/singer'/* webpackChunkName: "singer" */)
const SingerDetail = () => import('@/views/singer-detail'/* webpackChunkName: "SingerDetail" */)
const Album = () => import('@/views/album'/* webpackChunkName: "album" */)
const Search = () => import('@/views/search'/* webpackChunkName: "search" */)
const TopList = () => import('@/views/top-list'/* webpackChunkName: "top-list" */)
const TopDetail = () => import('@/views/top-detail'/* webpackChunkName: "top-detail" */)
const UserCenter = () => import('@/views/user-center'/* webpackChunkName: "user-center" */)

const routes = [
  {
    path: '/',
    redirect: '/recommend'
  },
  {
    path: '/recommend',
    name: Recommend,
    component: Recommend,
    children: [
      {
        path: ':id',
        component: Album
      }
    ]
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
    component: Search,
    children: [
      {
        path: ':id',
        component: SingerDetail
      }
    ]
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
  },
  {
    path: '/user',
    components: {
      user: UserCenter
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
