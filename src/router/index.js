import { createRouter, createWebHashHistory } from 'vue-router'
const Recommend = () => import('@/views/recommend'/* webpackChunkName: "recommend" */)
const Singer = () => import('@/views/singer'/* webpackChunkName: "singer" */)
const Search = () => import('@/views/search'/* webpackChunkName: "search" */)
const Rank = () => import('@/views/rank'/* webpackChunkName: "rank" */)

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
    component: Singer
  },
  {
    path: '/search',
    name: Search,
    component: Search
  },
  {
    path: '/rank',
    name: Rank,
    component: Rank
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
