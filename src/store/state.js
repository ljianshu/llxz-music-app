// 播放器的初始状态
import storage from 'good-storage'
import { PLAY_MODE, FAVORITE_KEY, SEARCH_KEY, PLAY_KEY } from '@/assets/js/constant'

const state = {
  sequenceList: [], // 初始播放列表
  playlist: [], // 实际播放列表
  playing: false, // 是否播放
  playMode: PLAY_MODE.sequence, // 播放形式
  currentIndex: 0, // 当前播放首歌的序号
  fullScreen: false, // 全屏还是收缩的
  favoriteList: storage.get(FAVORITE_KEY) || [], // 收藏歌曲列表  初始化时记得从本地先读取
  searchHistory: storage.get(SEARCH_KEY) || [], // 搜索历史记录 刷新页面时从本地先读取
  playHistory: storage.get(PLAY_KEY) || [] // 播放历史记录
}

export default state
